export const geographyDict = {
  en: {
    badge: 'AGRICULTURAL GEOGRAPHY',
    groundTruthBadge: 'V1 PRODUCTION GROUND TRUTH',
    title: 'ZARATI AGRICULTURAL GEOGRAPHY',
    subtitle: 'Explore verified agricultural markets, commodities, and data coverage across Sudan.',
    viewMap: 'Interactive Map',
    viewTable: 'Accessible Data Table',
    layers: 'Layers',
    layerMarkets: 'Verified Markets',
    layerCoverage: 'Data Coverage',
    layerWeather: 'Weather Coverage',
    allStates: 'All States (18)',
    allMarkets: 'All Markets',
    allCommodities: 'All Commodities',
    resetFilters: 'Reset Filters',
    activeFilters: 'Active Filters',
    
    // Status
    statusVerified: 'VERIFIED MARKET DATA',
    statusLimited: 'LIMITED VERIFIED DATA',
    statusNoData: 'NO VERIFIED ZARATI DATA',
    
    // Precision
    precExact: 'EXACT MARKET LOCATION',
    precApprox: 'LOCALITY APPROXIMATION',
    precNone: 'NO VERIFIED LOCATION',

    // Weather
    forecast: 'FORECAST',
    weatherActive: 'Weather Active',
    temp: 'Temperature',
    humidity: 'Humidity',
    precip: 'Precipitation',
    wind: 'Wind Speed',
    weatherAttribution: 'Provider: MET Norway (Norwegian Meteorological Institute)',
    weatherContextNote: 'Weather context presented alongside market observations. No causal relationship is inferred.',

    // Stats
    statesWithData: 'States with Verified Data',
    marketsRepresented: 'Markets Represented',
    trackedCommodities: 'Tracked Commodities',
    publishedObservations: 'Published Observations',
    latestObservation: 'Latest Observation',
    activeWeatherStation: 'Weather-Covered Station',

    // Context Panel
    nationalOverview: 'National Agricultural Coverage',
    nationalOverviewDesc: 'ZARATI V1 maps verified ground-truth market intelligence from the UN WFP Sudan Market Monitor and meteorological forecasts from MET Norway. 102 public-safe records isolated from 5,663 internal observations.',
    stateProfile: 'State Agricultural Profile',
    marketDetail: 'Market Intelligence Detail',
    combinedContext: 'Market & Weather Combined Context',
    noStateDataNote: 'No verified ZARATI market observations currently available for this state. This reflects platform data coverage, not agricultural productivity.',
    selectStatePrompt: 'Select a state to inspect regional agricultural data coverage.',
    selectMarketPrompt: 'Select a market marker on the map to inspect published prices and commodities.',

    // Price details
    sourcePrice: 'Source Observation Price',
    normalizedSdgMt: 'SDG / Metric Ton',
    normalizedSdgKg: 'SDG / KG',
    verifiedFxUnavailable: 'Verified FX Unavailable',
    observationDate: 'Observation Date',
    marketType: 'Market Structure',
    region: 'Region',
    capital: 'State Capital',
    dataSource: 'Data Source',
    wfpSource: 'UN WFP Sudan Market Monitor',
    coordinatePrecision: 'Coordinate Precision',

    // Map Legend & Context
    legendTitle: 'Cartographic Legend',
    legendVerifiedMarket: 'Market with Published Data',
    legendWeatherMarket: 'Gedaref Weather Station (MET Norway)',
    legendNile: 'Nile River System',
    legendIrrigated: 'Irrigated Scheme Zone (Informational)',
    legendRainfed: 'Mechanized Rainfed Belt (Informational)',
    legendGedarefPilot: 'Gedaref Proposed Pilot Center',
    schemeDisclaimer: 'Informational Agro-Ecological Context: Major production schemes shown as contextual reference (Ministry of Agriculture / FAO historical survey). These are broad ecological zones, not individual farm parcel boundaries.',

    // Table view
    thMarket: 'Market',
    thState: 'State',
    thCommodities: 'Commodities',
    thObservations: 'Published Obs',
    thLatestPrice: 'Latest Price (SDG/MT)',
    thLatestDate: 'Latest Date',
    thCoordinates: 'Coordinate Precision',
    thWeather: 'Weather',

    // Landscapes
    landscapesTitle: 'AGRICULTURAL LANDSCAPES & AGRO-ECOLOGICAL BELTS',
    landscapesSubtitle: 'Ground-level documentation across Sudan’s distinct soil, water, and production systems',
    landscape1Tag: 'RIVERINE IRRIGATED BELT',
    landscape1Title: 'Blue Nile & Main Nile Riverine Floodplains',
    landscape1Desc: 'Deep alluvial silt floodplains along the river system supporting intensive irrigation schemes, winter cereals, citrus, and vegetable production.',
    landscape1Location: 'River Nile & Khartoum States',
    landscape1Source: 'ZARATI Sovereign Agriculture Archive / FAO Land Cover',

    landscape2Tag: 'MECHANIZED RAINFED VERTISOL BELT',
    landscape2Title: 'Gedaref & Blue Nile Cracking Clay Plains',
    landscape2Desc: 'Expansive heavy vertisol clay plains spanning millions of feddans, forming Sudan’s national granary for sorghum and sesame production through semi-mechanized farming.',
    landscape2Location: 'Gedaref State (Proposed Pilot Area)',
    landscape2Source: 'Gedaref Agricultural Research Station / ZARATI Archive',

    landscape3Tag: 'GRAVITY-FED PUBLIC SCHEME',
    landscape3Title: 'Gezira Scheme Irrigation Canals',
    landscape3Desc: 'One of the world’s largest contiguous gravity-fed irrigation systems, fed by the Sennar Dam on the Blue Nile, historically anchoring cotton, wheat, and groundnut rotations.',
    landscape3Location: 'Gezira & Sennar States',
    landscape3Source: 'Sudan Irrigation Archive / Sudan Gezira Board',

    landscape4Tag: 'SAVANNA & GUM ARABIC BELT',
    landscape4Title: 'North Kordofan Sandy Qoz & Gum Acacia Plains',
    landscape4Desc: 'Traditional rainfed agro-pastoral belt characterized by sandy qoz soils and Hashab trees (Acacia senegal), producing world-class gum arabic, millet, and sesame.',
    landscape4Location: 'North & West Kordofan',
    landscape4Source: 'Agricultural Research Corporation (ARC) Sudan',

    // R10 Disclaimer
    visionDisclaimer: 'ZARATI V1 operates strictly on verified ground-truth market observations and meteorological forecasts. Automated parcel boundaries, satellite remote sensing, and vegetative index modeling (NDVI) remain part of the R10 Vision.'
  },
  ar: {
    badge: 'الجغرافيا الزراعية',
    groundTruthBadge: 'الحقيقة الإنتاجية المعتمدة V1',
    title: 'الجغرافيا الزراعية لزاراتي',
    subtitle: 'استكشف الأسواق الزراعية الموثقة، السلع، والتغطية البيانية الفعلية في أنحاء السودان.',
    viewMap: 'الخريطة التفاعلية',
    viewTable: 'جدول البيانات المتاح',
    layers: 'الطبقات البيانية',
    layerMarkets: 'الأسواق الموثقة',
    layerCoverage: 'التغطية البيانية',
    layerWeather: 'التغطية المناخية',
    allStates: 'كافة الولايات (18)',
    allMarkets: 'كافة الأسواق',
    allCommodities: 'كافة السلع',
    resetFilters: 'إعادة ضبط الفلاتر',
    activeFilters: 'الفلاتر النشطة',
    
    // Status
    statusVerified: 'بيانات سوقية موثقة',
    statusLimited: 'بيانات موثقة محدودة',
    statusNoData: 'لا توجد بيانات موثقة لزاراتي',
    
    // Precision
    precExact: 'موقع دقيق للسوق',
    precApprox: 'تقريب جغرافي للمحلية',
    precNone: 'لا يوجد موقع جغرافي موثق',

    // Weather
    forecast: 'توقعات جوية',
    weatherActive: 'المناخ نشط',
    temp: 'درجة الحرارة',
    humidity: 'الرطوبة النسبية',
    precip: 'معدل الأمطار',
    wind: 'سرعة الرياح',
    weatherAttribution: 'المزود: معهد الأرصاد الجوية النرويجي (MET Norway)',
    weatherContextNote: 'يُعرض السياق المناخي بجانب مراقبات السوق دون استنتاج علاقة سببية مباشرة.',

    // Stats
    statesWithData: 'ولايات ببيانات موثقة',
    marketsRepresented: 'الأسواق الممثلة',
    trackedCommodities: 'السلع المراقبة',
    publishedObservations: 'المراقبات المنشورة',
    latestObservation: 'أحدث مراقبة',
    activeWeatherStation: 'محطة مناخية نشطة',

    // Context Panel
    nationalOverview: 'نظرة عامة على التغطية الزراعية',
    nationalOverviewDesc: 'تعتمد زاراتي V1 على استخبارات سوقية موثقة ومطبعة من مرصد أسواق برنامج الأغذية العالمي وتوقعات معهد الأرصاد النرويجي. يتم نشر 102 سجلاً معتمداً معزولة عن 5,663 رصداً داخلياً.',
    stateProfile: 'الملف الزراعي للولاية',
    marketDetail: 'تفاصيل استخبارات السوق',
    combinedContext: 'السياق المزدوج للسوق والطقس',
    noStateDataNote: 'لا تتوفر حالياً مراقبات سوقية معتمدة لمنصة زاراتي في هذه الولاية. هذا يعكس نطاق التغطية البيانية للمنصة ولا يعني عدم وجود نشاط زراعي.',
    selectStatePrompt: 'اختر ولاية لعرض تغطية البيانات الإقليمية والسلع.',
    selectMarketPrompt: 'اختر سوقاً على الخريطة لعرض الأسعار والسلع المنشورة.',

    // Price details
    sourcePrice: 'سعر الرصد في المصدر',
    normalizedSdgMt: 'ج.س / طن متري',
    normalizedSdgKg: 'ج.س / كجم',
    verifiedFxUnavailable: 'سعر الصرف المعتمد غير متاح',
    observationDate: 'تاريخ الرصد',
    marketType: 'نوع السوق',
    region: 'الإقليم',
    capital: 'عاصمة الولاية',
    dataSource: 'مصدر البيانات',
    wfpSource: 'مرصد أسواق برنامج الأغذية العالمي (WFP)',
    coordinatePrecision: 'دقة الإحداثيات الجغرافية',

    // Map Legend & Context
    legendTitle: 'دليل الخريطة والمصطلحات',
    legendVerifiedMarket: 'سوق ببيانات منشورة',
    legendWeatherMarket: 'محطة طقس القضارف (MET Norway)',
    legendNile: 'شبكة حوض النيل',
    legendIrrigated: 'نطاق المشاريع المروية (استرشادي)',
    legendRainfed: 'حزام الزراعة المطرية الآلية (استرشادي)',
    legendGedarefPilot: 'مركز مشروع القضارف التجريبي المقترح',
    schemeDisclaimer: 'سياق بيئي وزراعي استرشادي: تمثل المخططات المروية والمطرية مناطق إنتاجية تاريخية معتمدة من مسوحات وزارة الزراعة ومنظمة الفاو، وليست حدود حيازات فردية.',

    // Table view
    thMarket: 'السوق',
    thState: 'الولاية',
    thCommodities: 'السلع المتاحة',
    thObservations: 'المراقبات المنشورة',
    thLatestPrice: 'أحدث سعر (ج.س/طن)',
    thLatestDate: 'أحدث تاريخ',
    thCoordinates: 'دقة الإحداثيات',
    thWeather: 'الطقس',

    // Landscapes
    landscapesTitle: 'الأنماط والمشاهد الزراعية والأحزمة البيئية',
    landscapesSubtitle: 'توثيق ميداني لطبيعة التضاريس والتربة في النظم الإنتاجية الزراعية بالسودان',
    landscape1Tag: 'الحزام النهري المروي',
    landscape1Title: 'السهول الفيضية لنهر النيل الأزرق والنيل الرئيسي',
    landscape1Desc: 'أراضٍ طميية عالية الخصوبة تمتد بمحاذاة مجرى النهرين، تدعم الزراعة المروية الكثيفة، القمح الشتوي، البساتين ومحاصيل الخضر.',
    landscape1Location: 'ولايات نهر النيل والخرطوم',
    landscape1Source: 'أرشيف زاراتي للزراعة السيادية / مسح غطاء الأرض بالفاو',

    landscape2Tag: 'حزام السهول الطينية المطرية',
    landscape2Title: 'سهول القضارف والنيل الأزرق الطينية المتشققة',
    landscape2Desc: 'سهول طينية سوداء ثقيلة تمتد لملايين الأفدنة، تشكل سلة الحبوب والسمسم الكبرى في السودان عبر الزراعة الآلية وشبه الآلية.',
    landscape2Location: 'ولاية القضارف (منطقة المشروع التجريبي المقترح)',
    landscape2Source: 'محطة بحوث القضارف الزراعية / أرشيف زاراتي',

    landscape3Tag: 'المشاريع القومية بالري الانسيابي',
    landscape3Title: 'قنوات الري بمشروع الجزيرة والمناقل',
    landscape3Desc: 'أحد أكبر مشاريع الري الانسيابي المترابطة في العالم، يتغذى من خزان سنار على النيل الأزرق لزراعة القطن والقمح والفول السوداني.',
    landscape3Location: 'ولايتي الجزيرة وسنار',
    landscape3Source: 'أرشيف الري السوداني / مشروع الجزيرة',

    landscape4Tag: 'حزام السافنا والصمغ العربي',
    landscape4Title: 'أراضي القوز الرملية وأشجار الهشاب بشمال كردفان',
    landscape4Desc: 'حزام رعوي وزراعي تقليدي يعتمد على الأمطار وتربة القوز وأشجار الهشاب المنتجة لأجود أنواع الصمغ العربي مع الدخن والسمسم.',
    landscape4Location: 'شمال وغرب كردفان',
    landscape4Source: 'هيئة البحوث الزراعية السودانية (ARC)',

    // R10 Disclaimer
    visionDisclaimer: 'تعمل منصة زاراتي V1 للجغرافيا الزراعية حصرياً على بيانات المراقبة السوقية والتوقعات المناخية الموثقة. تُعد التحليلات عبر الأقمار الصناعية ومؤشرات الغطاء النباتي (NDVI) جزءاً من رؤية المرحلة العاشرة (R10 Vision).'
  }
} as const

export type GeographyDictionary = typeof geographyDict.en
