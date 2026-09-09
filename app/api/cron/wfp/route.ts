import { NextResponse } from 'next/server';
import { WFPAdapter } from '@/lib/feeds/wfp/wfp-adapter';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createAdminClient();
  
  // Create an execution ledger entry. If one is already running, we should abort.
  // We can lock by checking if there's a running execution. 
  // In a real distributed system, we'd use pg_advisory_xact_lock via an RPC, but here we can rely on a quick status check or unique constraints.
  // For R4-B, a simple query check is sufficient for basic concurrency protection.
  const { data: running } = await supabase.from('external_feed_executions')
    .select('id')
    .eq('feed_type', 'WFP')
    .eq('status', 'running')
    .single();

  if (running) {
    return new NextResponse('Execution locked: A WFP feed is already running.', { status: 409 });
  }

  // Insert ledger entry
  const { data: execution, error: execError } = await supabase.from('external_feed_executions')
    .insert({ feed_type: 'WFP', status: 'running', started_at: new Date().toISOString() })
    .select('id')
    .single();

  if (execError || !execution) {
    return new NextResponse('Failed to initialize execution ledger.', { status: 500 });
  }

  const adapter = new WFPAdapter(execution.id);

  try {
    const result = await adapter.run();
    
    await supabase.from('external_feed_executions')
      .update({
        status: 'succeeded',
        completed_at: new Date().toISOString(),
        records_fetched: result.recordsFetched,
        records_valid: result.recordsValid,
        records_inserted: result.recordsInserted,
        records_existing: result.recordsExisting,
        records_rejected: result.recordsRejected,
        records_quarantined: result.recordsQuarantined,
        source_version: result.sourceVersion
      })
      .eq('id', execution.id);

    return NextResponse.json(result);
  } catch (err: any) {
    await supabase.from('external_feed_executions')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_category: 'FETCH_ERROR',
        error_summary: err.message
      })
      .eq('id', execution.id);
      
    return new NextResponse(`Feed execution failed: ${err.message}`, { status: 500 });
  }
}
