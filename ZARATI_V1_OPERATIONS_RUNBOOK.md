# ZARATI V1 OPERATIONS RUNBOOK

## Administration Access
The `/[lang]/operations` and `/[lang]/institutional` routes are gated.
To grant an operator access:
1. They must register via `/register`.
2. A DBA must manually update their `role` in the `profiles` table to `admin`.

## Feed Execution
### WFP Manual Sync
```bash
# Execute the Vercel API cron route
curl -X POST https://zarati.vercel.app/api/cron/wfp -H "Authorization: Bearer <CRON_SECRET>"
```

### MET Norway Manual Sync
```bash
curl -X POST https://zarati.vercel.app/api/cron/weather -H "Authorization: Bearer <CRON_SECRET>"
```

## Quarantine Management
If an observation fails normalization (e.g., negative price, unknown unit), it is marked `QUARANTINED`.
- View these in `/[lang]/operations` under the "Quarantine" tab.
- To resolve, manual database intervention is currently required to adjust `publication_status`.
