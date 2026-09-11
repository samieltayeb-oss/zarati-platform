'use client';

import { useMemo, useState } from 'react';
import type { MarketObservation, WeatherObservation } from '@/lib/services/intelligence';
import Link from 'next/link';

export function MinisterialPresentationClient({ 
  isAr, 
  observations, 
  weather,
  lang
}: { 
  isAr: boolean; 
  observations: MarketObservation[]; 
  weather: WeatherObservation | null;
  lang: string;
}) {
  const [slide, setSlide] = useState(0);

  const t = {
    exit: isAr ? 'خروج من العرض' : 'Exit Presentation',
    next: isAr ? 'التالي' : 'Next',
    prev: isAr ? 'السابق' : 'Previous',
    slides: [
      {
        title: isAr ? 'الاستخبارات الزراعية السيادية' : 'Sovereign Agricultural Intelligence',
        subtitle: isAr ? 'منصة زاراتي - دعم القرار المبني على البيانات' : 'ZARATI Platform - Data-Driven Decision Support',
      },
      {
        title: isAr ? 'واقع السوق اليوم' : 'Market Reality Today',
        content: isAr 
          ? `لدينا ${observations.length} رصد سوقي موثق ومطبع يغطي السلع الاستراتيجية.` 
          : `We currently hold ${observations.length} verified and normalized market observations covering strategic commodities.`,
      },
      {
        title: isAr ? 'تكامل المناخ والأسواق' : 'Weather & Market Integration',
        content: weather 
          ? (isAr ? `درجة الحرارة في القضارف: ${weather.temperature_celsius}°C مع ${weather.precipitation_mm} ملم أمطار.` : `Gedaref Temperature: ${weather.temperature_celsius}°C with ${weather.precipitation_mm}mm precipitation.`)
          : (isAr ? 'لا توجد بيانات مناخية متاحة حالياً.' : 'No weather data currently available.'),
      },
      {
        title: isAr ? 'فرصة المشروع التجريبي' : 'Pilot Opportunity',
        content: isAr ? 'القضارف جاهزة للتنفيذ التكنولوجي مع البيانات المتوفرة.' : 'Gedaref is ready for technological implementation with available data.',
      }
    ]
  };

  const handleNext = () => setSlide(s => Math.min(t.slides.length - 1, s + 1));
  const handlePrev = () => setSlide(s => Math.max(0, s - 1));

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-6 border-b border-white/10">
        <div className="text-2xl font-bold tracking-widest text-primary">ZARATI</div>
        <Link href={`/${lang}/institutional`} className="text-sm font-bold text-white/50 hover:text-white transition-colors">
          ✕ {t.exit}
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white max-w-4xl leading-tight">
          {t.slides[slide].title}
        </h1>
        {t.slides[slide].subtitle && (
          <p className="text-2xl md:text-3xl text-primary font-mono max-w-3xl">
            {t.slides[slide].subtitle}
          </p>
        )}
        {t.slides[slide].content && (
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl leading-relaxed">
            {t.slides[slide].content}
          </p>
        )}
      </div>

      <div className="p-6 border-t border-white/10 flex justify-between items-center">
        <button 
          onClick={handlePrev} 
          disabled={slide === 0}
          className="px-6 py-3 border border-white/20 rounded font-bold hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          {t.prev}
        </button>
        <div className="flex gap-2">
          {t.slides.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i === slide ? 'bg-primary' : 'bg-white/20'}`} />
          ))}
        </div>
        <button 
          onClick={handleNext} 
          disabled={slide === t.slides.length - 1}
          className="px-6 py-3 bg-primary text-navy rounded font-bold hover:bg-primary-dark disabled:opacity-30 transition-colors"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
}
