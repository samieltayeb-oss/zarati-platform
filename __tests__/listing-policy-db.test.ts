// @vitest-environment node
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { Client } from 'pg';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { assertLocalTarget, guardTestEnvironment } from './local-target';

guardTestEnvironment();
const sql = new Client({ connectionString: assertLocalTarget(process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54342/postgres', '54342') });
const actors = Object.fromEntries(['owner', 'other', 'trader', 'admin', 'suspended', 'banned', 'inactiveAdmin'].map(name => [name, randomUUID()]));
const rows: Record<string, string> = {};
let state: string;
async function as(name: string) {
  await sql.query(name === 'anon' ? 'SET LOCAL ROLE anon' : 'SET LOCAL ROLE authenticated');
  await sql.query("SELECT set_config('request.jwt.claims',$1,true)", [JSON.stringify({ role: name === 'anon' ? 'anon' : 'authenticated', sub: actors[name] })]);
}
async function insert(owner: string, extra = '') {
  return sql.query(`INSERT INTO public.listings(user_id,state_id,category,title_en,title_ar,quantity,unit,status${extra ? ',featured' : ''}) VALUES($1,$2,'crops','Local 028','Local 028',1,'kg','draft'${extra ? ',' + extra : ''}) RETURNING id`, [actors[owner], state]);
}
async function denied(query: string, params: unknown[] = []) {
  try { expect((await sql.query(query, params)).rowCount).toBe(0); }
  catch (error) {
    // Do not mistake syntax, unavailable DB, or missing-column errors for proof.
    expect(['42501', 'P0001']).toContain((error as { code: string }).code);
  }
}

beforeAll(async () => {
  await sql.connect();
  expect((await sql.query('SELECT inet_server_addr()::text addr, current_database() db')).rows[0].db).toBe('postgres');
  await sql.query('BEGIN');
  await sql.query("SELECT set_config('request.jwt.claims','{\"role\":\"service_role\"}',true)");
  state = (await sql.query('SELECT id FROM public.states LIMIT 1')).rows[0].id;
  for (const [name, id] of Object.entries(actors)) {
    await sql.query("INSERT INTO auth.users(id,email,raw_user_meta_data) VALUES($1,$2,$3)", [id, `${id}@local-028.invalid`, JSON.stringify({ role: name === 'trader' ? 'trader' : 'farmer', full_name: 'Local 028' })]);
    await sql.query('UPDATE public.profiles SET role=$2,status=$3 WHERE id=$1', [id, name.toLowerCase().includes('admin') ? 'admin' : name === 'trader' ? 'trader' : 'farmer', name === 'banned' ? 'banned' : ['suspended', 'inactiveAdmin'].includes(name) ? 'suspended' : 'active']);
    for (const status of ['draft', 'archived', 'active', 'pending_review', 'paused']) {
      const id = randomUUID(); rows[`${name}_${status}`] = id;
      await sql.query("INSERT INTO public.listings(id,user_id,state_id,category,title_en,title_ar,quantity,unit,status,moderation_status) VALUES($1,$2,$3,'crops','Local 028','Local 028',1,'kg',$4,$5)", [id, actors[name], state, status, ['active', 'paused'].includes(status) ? 'approved' : 'pending']);
    }
  }
});
beforeEach(() => sql.query('SAVEPOINT scenario'));
afterEach(async () => { await sql.query('ROLLBACK TO SAVEPOINT scenario'); await sql.query('RESET ROLE'); });
afterAll(async () => { await sql.query('ROLLBACK'); await sql.end(); });

describe('028 real local PostgreSQL listing authorization', () => {
  it('has exactly one canonical policy for each command, no inherited permissive bypass', async () => {
    const p = (await sql.query("SELECT policyname,cmd FROM pg_policies WHERE schemaname='public' AND tablename='listings' ORDER BY cmd")).rows;
    expect(p).toEqual([
      { policyname: 'listings_delete_lifecycle_owner_or_admin', cmd: 'DELETE' },
      { policyname: 'listings_insert_active_owner', cmd: 'INSERT' },
      { policyname: 'listings_select_public', cmd: 'SELECT' },
      { policyname: 'listings_update_active_owner_or_admin', cmd: 'UPDATE' },
    ]);
  });
  it('reconciles the production drift path as well as the clean reset path', async () => {
    await sql.query('DROP POLICY listings_insert_active_owner ON public.listings; DROP POLICY listings_update_active_owner_or_admin ON public.listings; DROP POLICY listings_delete_lifecycle_owner_or_admin ON public.listings');
    await sql.query(`CREATE POLICY "Farmers can read own listings" ON public.listings FOR SELECT TO authenticated USING(user_id=auth.uid());
      CREATE POLICY listings_insert_owner ON public.listings FOR INSERT WITH CHECK(user_id=auth.uid() AND public.is_active_user());
      CREATE POLICY listings_update_owner ON public.listings FOR UPDATE USING((user_id=auth.uid() AND public.is_active_user()) OR public.is_admin()) WITH CHECK((user_id=auth.uid() AND public.is_active_user()) OR public.is_admin());
      CREATE POLICY listings_delete_owner ON public.listings FOR DELETE USING((user_id=auth.uid() AND public.is_active_user()) OR public.is_admin());
      CREATE POLICY "Farmers can insert own listings" ON public.listings FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid() AND public.is_active_user());
      CREATE POLICY "Farmers can update own listings" ON public.listings FOR UPDATE TO authenticated USING(user_id=auth.uid() AND public.is_active_user()) WITH CHECK(user_id=auth.uid() AND public.is_active_user());
      CREATE POLICY "Farmers can delete own draft/archived listings" ON public.listings FOR DELETE TO authenticated USING(user_id=auth.uid() AND status IN ('draft','archived') AND public.is_active_user());`);
    await sql.query('SAVEPOINT before_exploit');
    await as('owner');
    expect((await sql.query('DELETE FROM public.listings WHERE id=$1 RETURNING id', [rows.owner_active])).rowCount).toBe(1);
    await sql.query('ROLLBACK TO SAVEPOINT before_exploit'); await sql.query('RESET ROLE');
    await as('inactiveAdmin');
    expect((await sql.query("UPDATE public.listings SET title_en='Inactive admin bypass' WHERE id=$1 RETURNING id", [rows.owner_active])).rowCount).toBe(1);
    await sql.query('ROLLBACK TO SAVEPOINT before_exploit'); await sql.query('RESET ROLE');
    await sql.query(readFileSync('supabase/migrations/20260909000028_028_reconcile_listing_policy_drift.sql', 'utf8'));
    await as('owner');
    await denied('DELETE FROM public.listings WHERE id=$1 RETURNING id', [rows.owner_active]);
  });
  it.each(['owner', 'suspended', 'banned'])('%s can read own draft', async name => {
    await as(name); expect((await sql.query('SELECT id FROM public.listings WHERE id=$1', [rows[`${name}_draft`]])).rowCount).toBe(1);
  });
  it.each(['owner', 'other', 'trader', 'admin'])('%s can read active listings', async name => {
    await as(name); expect((await sql.query('SELECT id FROM public.listings WHERE id=$1', [rows.owner_active])).rowCount).toBe(1);
  });
  it('anonymous can read approved public view but cannot read raw listings', async () => {
    await as('anon'); expect((await sql.query('SELECT id FROM public.public_listings_view WHERE id=$1', [rows.owner_active])).rowCount).toBe(1);
    await expect(sql.query('SELECT * FROM public.listings LIMIT 1')).rejects.toMatchObject({ code: '42501' });
  });
  it.each(['other', 'trader'])('%s cannot read another owner draft', async name => {
    await as(name); expect((await sql.query('SELECT id FROM public.listings WHERE id=$1', [rows.owner_draft])).rowCount).toBe(0);
  });
  it.each(['owner', 'trader'])('%s can insert own legitimate listing', async name => {
    await as(name); expect((await insert(name)).rowCount).toBe(1);
  });
  it('owner cannot insert for another owner', async () => { await as('owner'); await expect(insert('other')).rejects.toMatchObject({ code: '42501' }); });
  it('anonymous cannot insert', async () => { await as('anon'); await expect(insert('owner')).rejects.toMatchObject({ code: '42501' }); });
  it('owner cannot bypass RLS deletion through TRUNCATE', async () => {
    await as('owner'); await expect(sql.query('TRUNCATE public.listings CASCADE')).rejects.toMatchObject({ code: '42501' });
  });
  it('owner can edit normal fields', async () => { await as('owner'); expect((await sql.query("UPDATE public.listings SET title_en='Edited',quantity=2,price=25 WHERE id=$1 RETURNING title_en", [rows.owner_draft])).rows[0].title_en).toBe('Edited'); });
  it.each(['user_id', 'id', 'moderation_status', 'featured', 'views_count', 'inquiries_count', 'created_at'])('owner cannot alter privileged %s', async field => {
    const values: Record<string, unknown> = { user_id: actors.other, id: randomUUID(), moderation_status: 'approved', featured: true, views_count: 5, inquiries_count: 5, created_at: '2001-01-01' };
    await as('owner'); await denied(`UPDATE public.listings SET ${field}=$1 WHERE id=$2`, [values[field], rows.owner_draft]);
  });
  it('owner cannot self-verify profile (listing has no verification column)', async () => {
    await as('owner'); await denied('UPDATE public.profiles SET is_verified=true WHERE id=$1', [actors.owner]);
  });
  it('owner cannot create featured listing', async () => { await as('owner'); await expect(insert('owner', 'true')).rejects.toMatchObject({ code: 'P0001' }); });
  it.each(['draft', 'pending_review', 'archived'])('owner cannot publish %s directly', async status => {
    await as('owner'); await denied("UPDATE public.listings SET status='active' WHERE id=$1", [rows[`owner_${status}`]]);
  });
  it.each([['draft','pending_review'], ['draft','archived'], ['active','paused'], ['active','sold'], ['active','archived'], ['paused','active'], ['paused','archived']])('owner lifecycle %s to %s remains allowed', async (from, to) => {
    await as('owner'); expect((await sql.query('UPDATE public.listings SET status=$1 WHERE id=$2 RETURNING id', [to, rows[`owner_${from}`]])).rowCount).toBe(1);
  });
  it('unapproved paused listing cannot be resumed into publication', async () => {
    await sql.query("UPDATE public.listings SET moderation_status='rejected' WHERE id=$1", [rows.owner_paused]);
    await as('owner'); await denied("UPDATE public.listings SET status='active' WHERE id=$1", [rows.owner_paused]);
  });
  it.each(['draft', 'archived'])('owner may delete %s', async status => {
    await as('owner'); expect((await sql.query('DELETE FROM public.listings WHERE id=$1 RETURNING id', [rows[`owner_${status}`]])).rowCount).toBe(1);
  });
  it.each(['active', 'pending_review', 'paused'])('owner cannot delete protected %s', async status => {
    await as('owner'); await denied('DELETE FROM public.listings WHERE id=$1 RETURNING id', [rows[`owner_${status}`]]);
  });
  it.each(['other', 'trader', 'anon'])('%s cannot mutate another owner listing', async name => {
    await as(name); await denied("UPDATE public.listings SET title_en='Illegal' WHERE id=$1 RETURNING id", [rows.owner_active]);
  });
  it.each(['other', 'trader', 'anon'])('%s cannot delete another owner listing', async name => {
    await as(name); await denied('DELETE FROM public.listings WHERE id=$1 RETURNING id', [rows.owner_draft]);
  });
  it.each(['suspended', 'banned', 'inactiveAdmin'])('%s cannot insert', async name => {
    await as(name); await expect(insert(name)).rejects.toMatchObject({ code: '42501' });
  });
  it.each(['suspended', 'banned', 'inactiveAdmin'])('%s cannot edit', async name => {
    await as(name); await denied("UPDATE public.listings SET title_en='Illegal' WHERE id=$1 RETURNING id", [rows[`${name}_draft`]]);
  });
  it.each(['suspended', 'banned', 'inactiveAdmin'])('%s cannot delete even own draft', async name => {
    await as(name); await denied('DELETE FROM public.listings WHERE id=$1 RETURNING id', [rows[`${name}_draft`]]);
  });
  it('active admin can moderate and publish another owner listing', async () => {
    await as('admin'); expect((await sql.query("UPDATE public.listings SET moderation_status='approved',status='active',featured=true WHERE id=$1 RETURNING id", [rows.owner_pending_review])).rowCount).toBe(1);
  });
  it('active admin can delete active listing', async () => {
    await as('admin'); expect((await sql.query('DELETE FROM public.listings WHERE id=$1 RETURNING id', [rows.owner_active])).rowCount).toBe(1);
  });
});
