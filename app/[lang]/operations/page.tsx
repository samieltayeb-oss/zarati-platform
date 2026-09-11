import { redirect } from 'next/navigation';
import { isAuthorizedOperator, getFeedExecutions, getQuarantinedRecords, getMarketObservationsLineage, type FeedExecution } from '@/lib/services/operations';
import { OperationsDashboardClient } from './components/OperationsDashboardClient';

export const revalidate = 0; // Fresh data for operations

export default async function OperationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const isAuth = await isAuthorizedOperator();
  if (!isAuth) {
    redirect(`/${lang}/login`); // Unauthorized
  }

  let executions: FeedExecution[] = [];
  let quarantined: any[] = [];
  let lineage: any[] = [];
  let hasError = false;

  try {
    executions = await getFeedExecutions();
    quarantined = await getQuarantinedRecords();
    lineage = await getMarketObservationsLineage();
  } catch (err) {
    console.error('[OperationsPage] Error:', err);
    hasError = true;
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className={`min-h-screen bg-bg text-text ${isAr ? 'font-cairo' : 'font-sans'}`}>
      <div className="container mx-auto px-4 py-8 max-w-[1440px]">
        {hasError ? (
          <div className="p-8 border border-red-200 bg-red-50 text-red-700 rounded-lg text-center font-bold">
            {isAr ? 'خطأ في تحميل بيانات العمليات.' : 'Error loading operations data.'}
          </div>
        ) : (
          <OperationsDashboardClient 
            isAr={isAr}
            executions={executions}
            quarantined={quarantined}
            lineage={lineage}
          />
        )}
      </div>
    </div>
  );
}
