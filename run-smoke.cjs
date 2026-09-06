const { loadEnvConfig } = require('@next/env')
loadEnvConfig(process.cwd(), false, { VERCEL_ENV: 'production' })

require('child_process').execSync('npx tsx scripts/test-r2-production-smoke.ts', { stdio: 'inherit' })
