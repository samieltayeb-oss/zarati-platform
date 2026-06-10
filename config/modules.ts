export type ModuleStatus = 'active' | 'coming-soon' | 'disabled' | 'standalone-candidate'

export interface ModuleConfig {
  id: string
  status: ModuleStatus
  labelEn: string
  labelAr: string
  path: string
  icon: string
  descriptionEn: string
  descriptionAr: string
}

export const MODULES = {
  marketplace: {
    id: 'marketplace',
    status: 'active' as ModuleStatus,
    labelEn: 'Marketplace',
    labelAr: 'السوق',
    path: '/marketplace',
    icon: 'ShoppingCart',
    descriptionEn: 'Buy and sell crops, equipment, seeds, and fertilizer',
    descriptionAr: 'اشترِ وبِع المحاصيل والمعدات والبذور والأسمدة',
  },
  weather: {
    id: 'weather',
    status: 'active' as ModuleStatus,
    labelEn: 'Weather Intelligence',
    labelAr: 'معلومات الطقس',
    path: '/weather',
    icon: 'Cloud',
    descriptionEn: 'Agricultural weather for Sudan\'s key farming regions',
    descriptionAr: 'أحوال الطقس الزراعي في المناطق الرئيسية بالسودان',
  },
  aiAdvisor: {
    id: 'ai-advisor',
    status: 'coming-soon' as ModuleStatus,
    labelEn: 'AI Advisor',
    labelAr: 'المستشار الذكي',
    path: '/ai-advisor',
    icon: 'Brain',
    descriptionEn: 'Personalized AI recommendations for your farm',
    descriptionAr: 'توصيات ذكاء اصطناعي مخصصة لمزرعتك',
  },
  financing: {
    id: 'financing',
    status: 'coming-soon' as ModuleStatus,
    labelEn: 'Financing & Microloans',
    labelAr: 'التمويل والقروض الصغيرة',
    path: '/financing',
    icon: 'Banknote',
    descriptionEn: 'Access microloans and agricultural financing',
    descriptionAr: 'احصل على القروض الصغيرة والتمويل الزراعي',
  },
  ngoPortal: {
    id: 'ngo',
    status: 'coming-soon' as ModuleStatus,
    labelEn: 'NGO Portal',
    labelAr: 'بوابة المنظمات',
    path: '/ngo',
    icon: 'Heart',
    descriptionEn: 'Tools for NGOs supporting Sudan\'s farmers',
    descriptionAr: 'أدوات للمنظمات الداعمة لمزارعي السودان',
  },
  governmentPortal: {
    id: 'government',
    status: 'coming-soon' as ModuleStatus,
    labelEn: 'Government Portal',
    labelAr: 'البوابة الحكومية',
    path: '/government',
    icon: 'Building2',
    descriptionEn: 'National agricultural data and policy tools',
    descriptionAr: 'بيانات زراعية وطنية وأدوات السياسات',
  },
  satelliteMonitoring: {
    id: 'satellite',
    status: 'disabled' as ModuleStatus,
    labelEn: 'Satellite Monitoring',
    labelAr: 'المراقبة الفضائية',
    path: '/satellite',
    icon: 'Satellite',
    descriptionEn: 'NDVI and satellite imagery for crop health monitoring',
    descriptionAr: 'صور فضائية ومؤشر NDVI لمراقبة صحة المحاصيل',
  },
} as const satisfies Record<string, ModuleConfig>

export type ModuleId = keyof typeof MODULES

export function isModuleActive(id: ModuleId): boolean {
  return MODULES[id].status === 'active'
}
