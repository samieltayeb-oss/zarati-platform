import { redirect } from 'next/navigation';
import { isInstitutionalUser, getPublicFeedHealth } from '@/lib/services/institutional';
import { getMarketObservations, getMetNorwayWeather } from '@/lib/services/intelligence';
import { InstitutionalDashboardClient } from './components/InstitutionalDashboardClient';

export const revalidate = 0;

export default async function InstitutionalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const isAuth = await isInstitutionalUser();
  if (!isAuth) {
    redirect(`/${lang}/login`);
  }

  const [observations, weather, feedHealth] = await Promise.all([
    getMarketObservations(),
    getMetNorwayWeather(),
    getPublicFeedHealth()
  ]);

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className={`min-h-screen bg-bg text-text ${isAr ? 'font-cairo' : 'font-sans'}`}>
      <div className="container mx-auto px-4 py-8 max-w-[1440px]">
        <InstitutionalDashboardClient 
          isAr={isAr} 
          observations={observations} 
          weather={weather} 
          feedHealth={feedHealth}
          lang={lang}
        />
      </div>
    </div>
  );
}
