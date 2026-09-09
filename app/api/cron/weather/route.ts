import { handleFeedCron } from '@/lib/feeds/cron';
export const runtime = 'nodejs';
export const maxDuration = 300;
export async function GET(request: Request) { return handleFeedCron(request, 'OPEN_METEO'); }
