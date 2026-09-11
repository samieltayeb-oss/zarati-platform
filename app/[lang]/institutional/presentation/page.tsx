import { redirect } from 'next/navigation';
import { isInstitutionalUser, getPublicFeedHealth } from '@/lib/services/institutional';
import { getMarketObservations, getMetNorwayWeather } from '@/lib/services/intelligence';
import { MinisterialPresentationClient } from './components/MinisterialPresentationClient';

export const revalidate = 0;

export default async function MinisterialPresentationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const isAuth = await isInstitutionalUser();
  if (!isAuth) {
    redirect(`/${lang}/login`);
  }

  const [observations, weather] = await Promise.all([
    getMarketObservations(),
    getMetNorwayWeather()
  ]);

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className={`min-h-screen bg-navy text-white ${isAr ? 'font-cairo' : 'font-sans'}`}>
      <MinisterialPresentationClient 
        isAr={isAr} 
        observations={observations} 
        weather={weather} 
        lang={lang}
      />
    </div>
  );
}
