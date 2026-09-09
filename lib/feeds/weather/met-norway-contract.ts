// Public provider metadata; no credentials. The project reference identifies the real application.
export const MET_LOCATION = { latitude: 14.04, longitude: 35.38, reference: 'MKT-GD-01 / WFP market 2580' } as const;
export const MET_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=14.04&lon=35.38';
export const MET_USER_AGENT = 'ZARATI/0.1 (https://github.com/samieltayeb-oss/zarati-platform)';
export const MET_ATTRIBUTION = {
    provider: 'MET_NORWAY',
    attribution: 'Data from MET Norway',
    source_url: MET_URL,
    license_url: 'https://creativecommons.org/licenses/by/4.0/',
    processing_note: 'Forecast subset; wind converted from m/s to km/h. Precipitation is the sum over the following interval. No station observations.',
} as const;
