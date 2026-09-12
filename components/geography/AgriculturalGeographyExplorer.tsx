'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n/config'
import { geographyDict } from '@/lib/i18n/geography-dict'
import type { GeographyDataBundle, EnrichedMarket } from '@/lib/services/geography'
import { SudanBadge } from '@/components/brand/sudan-badge'

interface Props {
  lang: Locale
  data: GeographyDataBundle
}

// Vector path for Sudan ADM0 international borders (post-2011, South Sudan excluded)
const SUDAN_PATH = "M 421.7,10.0 L414.8,15.8 L409.1,20.7 L403.9,19.2 L401.5,18.5 L400.6,20.6 L396.8,28.7 L395.2,32.1 L393.8,35.3 L392.0,35.6 L386.8,36.5 L382.0,37.4 L379.5,37.8 L377.9,38.1 L377.0,40.6 L376.4,42.4 L375.8,44.2 L375.1,46.1 L373.5,51.0 L365.3,51.9 L360.3,52.4 L353.3,47.6 L351.2,46.1 L348.4,44.2 L341.1,44.1 L331.3,44.2 L329.1,44.2 L326.4,44.2 L306.5,44.2 L305.0,44.1 L296.1,44.1 L296.5,42.5 L297.5,40.8 L298.7,39.7 L298.7,38.2 L296.5,38.5 L295.3,39.7 L294.3,41.0 L294.1,42.5 L293.4,44.1 L280.8,44.2 L268.5,44.2 L256.4,44.1 L244.6,44.1 L232.5,44.1 L220.6,44.1 L208.5,44.1 L196.6,44.1 L192.3,44.1 L190.5,44.1 L184.7,44.1 L172.5,44.1 L160.3,44.1 L148.2,44.2 L136.1,44.2 L124.2,44.1 L112.2,44.1 L109.7,44.1 L106.9,44.1 L105.1,44.1 L105.0,51.6 L105.0,59.7 L104.9,68.0 L105.0,76.1 L105.0,84.1 L105.0,89.4 L105.0,92.2 L105.1,100.3 L105.1,101.9 L105.1,103.6 L75.2,103.6 L75.2,115.5 L75.2,131.5 L75.3,144.0 L75.3,162.1 L75.2,198.8 L75.3,200.5 L75.3,208.3 L75.3,212.7 L75.3,214.5 L75.2,221.3 L75.2,223.5 L75.2,225.0 L75.2,226.8 L75.2,229.7 L75.2,231.8 L73.7,231.8 L72.1,231.4 L70.2,230.8 L68.7,230.6 L67.2,230.7 L65.5,230.3 L64.0,230.3 L62.5,230.4 L60.6,230.9 L59.2,231.5 L57.5,232.2 L55.9,232.4 L54.4,232.3 L52.9,232.1 L51.3,231.8 L49.7,231.7 L48.2,232.1 L47.2,233.3 L46.2,234.5 L45.0,235.5 L43.6,236.3 L43.1,237.8 L43.4,239.4 L44.6,240.4 L45.1,241.9 L45.5,243.5 L45.2,245.0 L45.2,246.5 L44.2,247.7 L43.2,248.9 L43.2,250.4 L41.7,250.5 L40.8,251.8 L39.5,252.6 L38.6,253.8 L38.2,255.4 L36.8,256.4 L35.6,257.5 L35.7,259.1 L36.5,260.8 L36.3,262.4 L32.8,263.7 L31.0,263.8 L29.6,264.4 L27.8,265.1 L27.0,267.5 L28.5,268.1 L28.6,270.2 L28.7,271.8 L29.0,273.3 L28.7,274.8 L29.8,275.9 L31.3,275.8 L32.2,277.2 L31.8,279.0 L30.2,279.8 L28.8,281.5 L27.3,281.6 L25.8,282.5 L24.5,284.1 L22.8,284.3 L20.9,286.2 L19.3,287.9 L18.1,289.2 L18.9,290.6 L19.2,292.1 L19.7,293.6 L20.7,295.0 L21.9,296.0 L22.3,297.5 L22.3,299.0 L23.1,300.3 L24.3,301.2 L23.9,302.8 L22.8,304.0 L21.6,305.2 L20.5,306.5 L19.6,307.7 L18.0,308.3 L16.5,308.7 L15.4,309.8 L14.1,310.8 L13.4,312.2 L14.1,310.8 L15.3,309.9 L16.2,308.7 L15.3,309.9 L14.1,310.8 L13.5,312.3 L12.5,313.5 L11.9,314.9 L11.2,316.8 L10.5,318.2 L11.1,319.7 L11.6,321.3 L12.6,322.6 L13.8,323.5 L15.3,323.9 L16.9,323.5 L18.4,323.1 L20.1,322.7 L21.3,321.7 L21.4,320.2 L22.8,321.0 L24.8,322.1 L26.6,322.9 L28.0,323.5 L29.2,324.4 L28.6,325.9 L28.0,327.4 L27.2,328.7 L27.4,330.2 L28.3,331.4 L28.4,332.9 L28.7,334.5 L29.5,335.8 L30.1,337.2 L30.2,338.7 L29.9,340.3 L29.8,341.8 L31.4,341.2 L32.9,340.9 L34.4,340.9 L34.1,342.6 L33.0,346.6 L32.4,350.0 L32.3,353.7 L33.5,355.5 L34.6,356.6 L36.3,357.6 L37.8,358.1 L38.9,359.4 L40.2,360.2 L43.6,359.9 L43.5,361.8 L44.1,363.3 L45.0,365.1 L44.6,366.8 L43.7,368.8 L42.6,371.8 L42.1,373.4 L41.6,374.9 L42.8,376.1 L43.4,377.7 L44.5,379.3 L45.3,380.6 L46.5,381.6 L47.9,382.6 L49.9,384.6 L51.1,385.5 L52.3,386.5 L53.5,387.8 L54.9,388.5 L55.8,390.1 L56.6,391.4 L57.9,393.4 L60.8,398.1 L63.0,401.6 L64.0,403.3 L64.9,404.9 L65.5,406.3 L65.7,408.0 L65.9,409.7 L66.2,412.1 L65.5,413.5 L64.6,415.0 L63.4,416.2 L63.5,417.9 L64.4,419.1 L64.6,420.7 L64.6,422.2 L63.7,423.5 L63.9,425.0 L62.9,426.2 L61.7,427.1 L62.9,426.2 L63.8,425.0 L62.9,426.2 L61.6,427.1 L59.9,427.2 L59.3,428.6 L58.9,430.6 L59.1,432.1 L60.5,432.9 L61.9,432.0 L63.4,432.6 L63.0,434.1 L62.5,435.6 L61.5,436.8 L61.1,438.4 L61.5,439.9 L63.1,439.4 L64.6,439.6 L65.6,440.8 L67.1,441.5 L68.5,440.8 L70.2,440.5 L71.7,440.7 L73.2,441.4 L74.8,441.3 L76.3,440.8 L77.5,441.8 L79.0,441.6 L80.5,441.4 L82.0,440.8 L82.7,442.2 L83.9,441.3 L85.6,439.6 L87.0,438.4 L89.5,437.5 L90.9,436.9 L92.5,434.6 L92.2,432.9 L91.6,431.3 L91.5,429.6 L91.9,427.7 L92.4,425.9 L93.1,424.3 L93.9,422.7 L93.0,421.2 L94.2,420.2 L95.6,419.0 L97.0,418.0 L97.7,416.5 L97.7,414.9 L97.1,413.4 L97.3,411.8 L96.7,410.4 L97.9,409.5 L99.1,408.4 L99.9,406.9 L101.4,405.8 L102.7,404.8 L103.8,403.7 L104.9,402.5 L106.0,401.4 L106.4,399.7 L106.5,398.2 L106.2,396.4 L107.0,395.0 L107.8,393.6 L108.9,392.5 L110.5,392.8 L112.0,392.2 L113.7,392.2 L115.3,392.4 L116.9,391.7 L118.4,391.4 L119.9,391.4 L121.4,391.5 L122.8,390.9 L124.3,390.5 L125.8,390.3 L127.3,390.3 L128.7,389.7 L130.2,389.4 L131.7,389.9 L132.7,391.1 L133.2,392.8 L133.2,394.5 L133.2,396.2 L133.2,398.3 L134.6,399.1 L136.3,399.9 L137.4,401.0 L138.2,402.3 L139.6,403.8 L141.2,405.3 L141.9,407.0 L142.8,410.0 L143.5,411.8 L144.1,413.2 L145.2,414.6 L146.6,415.6 L148.1,416.1 L149.6,416.5 L151.5,416.9 L153.0,417.3 L154.6,417.8 L156.6,417.7 L158.5,417.2 L160.3,416.4 L162.1,415.6 L164.0,414.9 L166.1,414.2 L168.6,413.7 L170.1,413.6 L171.7,413.6 L174.5,413.8 L176.3,413.7 L178.5,413.7 L180.1,413.8 L182.0,414.0 L184.4,414.1 L186.1,414.2 L187.7,414.3 L189.2,414.2 L191.1,414.1 L193.8,418.3 L195.4,421.5 L202.5,422.0 L205.2,421.9 L210.6,421.9 L217.1,421.9 L217.1,420.3 L218.0,419.0 L218.7,417.6 L220.1,416.3 L221.7,414.8 L223.0,413.7 L224.2,412.4 L225.4,411.1 L226.5,410.0 L231.1,409.9 L240.3,409.9 L240.3,402.3 L240.4,400.1 L243.9,398.2 L247.6,396.3 L249.7,395.2 L252.3,393.9 L254.0,393.8 L255.9,394.9 L257.3,395.8 L258.7,396.7 L260.1,397.6 L261.5,398.4 L268.0,402.4 L269.3,403.3 L271.8,405.2 L273.5,406.6 L275.6,408.2 L277.4,409.7 L278.7,410.7 L280.2,410.2 L287.6,409.9 L289.3,409.9 L291.1,409.8 L293.0,409.3 L294.4,408.3 L295.5,406.9 L296.5,405.6 L298.2,404.3 L299.1,403.1 L300.6,401.6 L302.7,398.9 L303.7,397.6 L305.0,396.0 L306.0,394.8 L307.4,393.6 L308.4,392.0 L309.5,390.2 L311.7,387.8 L314.3,387.3 L315.6,388.1 L318.3,388.5 L320.5,387.2 L320.6,385.5 L320.3,384.0 L319.5,381.1 L323.0,377.7 L324.3,376.3 L325.9,374.8 L327.4,373.3 L327.1,371.3 L326.3,369.8 L325.6,368.4 L325.4,366.7 L325.2,365.1 L325.2,363.1 L325.1,361.1 L325.1,358.9 L325.4,355.4 L325.4,353.1 L324.9,351.3 L318.5,345.7 L316.9,344.4 L320.4,344.3 L323.5,344.3 L327.9,344.3 L335.8,344.3 L336.3,342.6 L336.1,340.9 L335.9,338.9 L335.9,337.3 L335.6,335.8 L340.5,335.8 L343.9,335.9 L351.2,336.3 L351.2,337.8 L350.6,340.8 L350.2,342.9 L349.6,346.1 L348.8,350.5 L347.7,353.8 L348.1,355.9 L348.5,358.3 L348.7,361.0 L349.4,365.2 L350.7,372.5 L350.9,374.3 L351.5,377.7 L350.7,379.0 L350.1,380.5 L354.2,381.7 L357.1,382.5 L358.4,383.3 L359.5,384.6 L363.5,389.3 L365.2,390.7 L366.4,391.7 L367.7,393.3 L369.3,395.8 L370.2,397.2 L371.9,397.6 L372.5,399.1 L373.2,400.6 L373.4,402.2 L373.1,403.8 L373.0,405.5 L372.5,407.0 L372.1,408.6 L370.9,409.7 L370.6,411.2 L370.2,413.0 L370.0,414.5 L370.0,416.0 L370.7,417.4 L372.8,417.4 L374.5,417.4 L376.1,417.4 L376.6,415.4 L377.1,413.7 L378.2,409.9 L379.1,407.7 L379.8,406.0 L380.0,404.3 L380.6,400.8 L382.5,399.5 L383.3,398.2 L383.6,396.7 L383.6,395.2 L383.0,393.1 L382.6,391.6 L382.7,389.3 L382.3,387.7 L382.0,386.2 L382.7,384.8 L383.9,383.7 L385.1,382.4 L386.3,380.2 L387.2,378.4 L388.6,377.4 L391.0,375.7 L392.9,376.8 L394.2,378.0 L395.5,379.4 L397.0,380.1 L398.7,380.3 L399.3,378.7 L401.0,377.3 L402.5,376.1 L402.2,374.3 L402.1,372.7 L402.4,371.2 L403.4,367.0 L402.4,365.8 L402.2,364.3 L402.8,362.7 L403.9,361.1 L404.8,359.8 L405.1,358.1 L405.8,356.7 L405.8,354.7 L405.8,353.1 L405.0,351.3 L406.0,348.2 L408.2,346.7 L410.9,344.7 L412.0,342.7 L413.2,340.6 L415.1,337.2 L416.1,335.5 L416.8,334.1 L419.9,329.0 L421.2,326.7 L422.5,324.7 L423.7,323.2 L425.2,323.1 L426.9,322.8 L428.8,322.2 L432.0,321.4 L433.6,321.1 L435.3,321.3 L436.5,322.2 L438.0,322.0 L438.3,319.2 L438.4,317.0 L437.8,315.3 L437.8,313.7 L438.4,312.3 L438.9,310.7 L439.4,308.9 L440.0,306.6 L440.5,304.9 L441.0,303.2 L441.5,301.5 L442.6,299.5 L444.0,297.0 L445.1,293.5 L445.8,291.5 L446.4,290.0 L447.2,288.7 L447.5,286.4 L446.7,283.6 L447.9,280.6 L448.8,277.7 L449.6,275.7 L448.7,273.1 L448.1,267.3 L447.6,262.6 L447.0,256.8 L446.7,253.3 L446.1,249.1 L447.7,246.8 L449.3,245.4 L450.8,241.7 L451.7,239.7 L452.0,238.2 L452.3,236.7 L452.8,235.2 L453.4,233.2 L454.1,231.1 L455.3,229.1 L456.4,226.6 L457.4,223.9 L457.9,222.3 L458.4,220.8 L459.7,216.7 L460.6,215.5 L461.3,214.1 L460.9,212.6 L461.7,211.0 L460.7,209.5 L459.7,207.9 L459.7,205.8 L460.0,204.3 L461.0,203.0 L462.5,201.8 L462.8,200.1 L462.9,198.3 L462.8,195.7 L462.3,194.0 L463.4,192.6 L463.9,190.3 L465.5,190.7 L466.8,191.6 L468.7,191.5 L470.3,191.1 L471.8,190.6 L473.2,191.2 L474.6,191.8 L475.2,190.4 L476.4,189.5 L476.9,188.0 L477.5,186.5 L477.9,185.0 L478.1,183.5 L480.2,182.5 L482.0,182.2 L483.7,182.1 L485.2,181.9 L485.9,180.5 L485.9,179.0 L487.4,178.5 L488.6,179.6 L490.1,179.8 L491.6,178.9 L492.3,177.5 L493.9,176.9 L494.7,178.2 L495.9,179.2 L495.9,177.5 L497.0,176.3 L498.4,177.0 L499.9,176.8 L500.9,175.6 L501.8,174.3 L503.3,173.4 L504.1,171.7 L504.5,170.2 L505.5,168.0 L506.1,166.5 L507.5,165.3 L509.0,163.9 L509.3,162.4 L508.7,160.9 L507.6,162.0 L506.4,161.1 L505.2,160.2 L504.4,158.9 L503.8,157.4 L502.6,158.3 L501.2,157.7 L501.0,156.2 L501.9,155.0 L500.4,155.3 L499.6,156.9 L498.3,156.0 L496.7,155.9 L495.6,154.8 L495.1,153.3 L495.6,151.7 L494.6,150.3 L493.2,149.3 L492.2,148.1 L491.0,146.8 L489.4,146.0 L487.8,145.5 L486.4,144.7 L485.3,143.3 L484.0,142.4 L482.4,142.0 L480.9,142.2 L479.4,142.2 L478.1,141.3 L477.1,140.1 L476.2,138.9 L475.3,137.5 L475.0,135.9 L474.7,134.3 L474.4,132.8 L473.8,131.4 L472.6,130.4 L472.9,128.8 L472.7,127.3 L472.5,125.7 L472.2,124.2 L472.3,122.7 L472.0,121.1 L471.3,119.6 L470.7,118.2 L470.2,116.7 L470.0,114.9 L470.0,113.4 L470.6,111.7 L470.5,110.2 L470.8,108.7 L469.9,107.0 L469.2,105.6 L468.6,104.2 L468.4,102.7 L469.3,101.5 L469.3,100.0 L469.0,98.5 L468.6,96.9 L468.9,95.2 L468.5,93.6 L468.9,92.1 L468.5,90.5 L469.9,89.9 L470.0,88.1 L469.5,86.3 L469.1,84.6 L468.2,83.3 L468.3,81.8 L468.1,80.3 L467.9,78.6 L467.5,77.0 L467.2,75.5 L466.5,74.0 L465.6,72.7 L466.6,71.5 L466.4,69.9 L465.7,68.3 L466.9,67.4 L467.7,68.8 L468.8,69.9 L470.0,71.0 L471.0,72.4 L469.6,71.3 L469.8,72.8 L471.4,73.5 L472.4,72.0 L471.2,70.6 L470.1,69.0 L469.0,67.7 L467.4,66.6 L466.2,65.2 L465.2,63.9 L463.7,63.5 L463.8,62.0 L463.0,60.7 L461.7,59.7 L461.7,58.2 L461.0,56.8 L459.9,55.7 L460.5,54.3 L459.3,53.3 L459.9,51.9 L458.3,52.1 L459.6,51.3 L459.5,49.8 L458.0,49.2 L459.1,48.1 L459.3,46.6 L458.7,45.2 L459.6,43.8 L459.7,42.3 L458.3,41.7 L456.9,40.6 L456.0,39.1 L454.5,39.3 L453.3,38.4 L452.3,37.2 L450.8,36.0 L449.6,35.1 L448.0,34.3 L446.5,33.7 L445.6,32.5 L445.0,31.1 L443.5,30.5 L442.2,29.4 L441.7,27.8 L440.9,26.3 L439.8,25.1 L438.6,24.2 L437.1,24.2 L435.6,24.0 L434.1,23.8 L432.5,23.6 L431.1,22.8 L429.8,22.0 L428.5,21.1 L427.3,20.1 L427.0,18.6 L425.9,17.5 L425.0,16.3 L423.8,15.3 L422.9,14.1 L422.7,12.6 L422.1,11.1 Z"

// River vector paths
const NILE_WHITE  = 'M 337.2,349.6 C 336,328 334.5,315 333.7,308 C 332,285 331,260 329.6,236.5'
const NILE_BLUE   = 'M 375.7,357 C 370,330 365,312 362,296.4 C 360,284 359,275 358.1,271.1 C 350,257 341,247 329.6,236.5'
const NILE_MAIN   = 'M 329.6,236.5 C 342,218 353,207 356.3,202.4 C 364,190 370,180 372.4,172.5 L 373,163 C 366,140 358,127 353,117.9 C 338,126 322,138 309,148 C 293,155 280,155 274,148 C 270,140 268.4,134 268.4,128.7 C 276,102 285,72 294.5,50'
const NILE_ATBARA = 'M 415,128 C 405,140 393,158 372.4,172.5'
const KHOR_GASH   = 'M 450,260 C 448,250 445,242 444.8,239.6 C 440,230 435,215 430,200'

export function AgriculturalGeographyExplorer({ lang, data }: Props) {
  const isAr = lang === 'ar'
  const t = geographyDict[isAr ? 'ar' : 'en']

  // State
  const [selectedStateId, setSelectedStateId] = useState<string>('ALL')
  const [selectedMarketId, setSelectedMarketId] = useState<string>('ALL')
  const [selectedCommodity, setSelectedCommodity] = useState<string>('ALL')
  const [activeLayer, setActiveLayer] = useState<'markets' | 'coverage' | 'weather'>('markets')
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map')
  const [showSchemes, setShowSchemes] = useState<boolean>(true)
  const [hoveredMarket, setHoveredMarket] = useState<EnrichedMarket | null>(null)

  // Filtered Markets
  const filteredMarkets = useMemo(() => {
    return data.markets.filter((m) => {
      if (selectedStateId !== 'ALL' && m.state_id !== selectedStateId) return false
      if (selectedMarketId !== 'ALL' && m.id !== selectedMarketId) return false
      if (selectedCommodity !== 'ALL') {
        const hasComm = m.commodities.some((c) => c.name_en === selectedCommodity || c.code === selectedCommodity)
        if (!hasComm) return false
      }
      return true
    })
  }, [data.markets, selectedStateId, selectedMarketId, selectedCommodity])

  // Markets with coordinates to display on map
  const visibleMapMarkets = useMemo(() => {
    return filteredMarkets.filter((m) => m.hasVerifiedCoordinates && m.coordinates !== null)
  }, [filteredMarkets])

  // Selected entities
  const activeState = useMemo(() => {
    if (selectedStateId === 'ALL') return null
    return data.states.find((s) => s.id === selectedStateId) || null
  }, [data.states, selectedStateId])

  const activeMarket = useMemo(() => {
    if (selectedMarketId === 'ALL') return null
    return data.markets.find((m) => m.id === selectedMarketId) || null
  }, [data.markets, selectedMarketId])

  // Reset Filters handler
  const handleResetFilters = () => {
    setSelectedStateId('ALL')
    setSelectedMarketId('ALL')
    setSelectedCommodity('ALL')
  }

  // Handle clicking on a market marker on the map
  const handleSelectMarket = (market: EnrichedMarket) => {
    if (selectedMarketId === market.id) {
      setSelectedMarketId('ALL')
    } else {
      setSelectedMarketId(market.id)
      setSelectedStateId(market.state_id)
    }
  }

  return (
    <div className={`space-y-8 ${isAr ? 'font-cairo' : ''}`}>
      {/* 1. Compact Masthead */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <SudanBadge lang={lang} variant="header" className="text-[11px]" />
            <span className="bg-primary/10 text-primary border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono rounded">
              {t.groundTruthBadge}
            </span>
            <span className="bg-surface-elevated text-muted border border-border px-2.5 py-0.5 text-[10px] font-mono rounded">
              {t.dataSource}: {t.wfpSource}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text">
            {t.title}
          </h1>
          <p className="text-muted text-sm md:text-base max-w-3xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-2 bg-surface-elevated p-1 rounded-lg border border-border self-start md:self-auto">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'map'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-text'
            }`}
            aria-label={t.viewMap}
          >
            <span>🗺️</span>
            <span>{t.viewMap}</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-text'
            }`}
            aria-label={t.viewTable}
          >
            <span>📋</span>
            <span>{t.viewTable}</span>
          </button>
        </div>
      </div>

      {/* 2. Geography Command / Filter Bar */}
      <div className="bg-surface-canvas border border-border-strong rounded-xl p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Layer Selector */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1 font-semibold">
              {t.layers}
            </label>
            <div className="grid grid-cols-3 gap-1 bg-surface-elevated p-1 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setActiveLayer('markets')}
                className={`py-1 text-[11px] font-bold rounded text-center transition-colors ${
                  activeLayer === 'markets' ? 'bg-primary text-white' : 'text-muted hover:text-text'
                }`}
              >
                {t.layerMarkets}
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('coverage')}
                className={`py-1 text-[11px] font-bold rounded text-center transition-colors ${
                  activeLayer === 'coverage' ? 'bg-primary text-white' : 'text-muted hover:text-text'
                }`}
              >
                {t.layerCoverage}
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('weather')}
                className={`py-1 text-[11px] font-bold rounded text-center transition-colors ${
                  activeLayer === 'weather' ? 'bg-primary text-white' : 'text-muted hover:text-text'
                }`}
              >
                {t.layerWeather}
              </button>
            </div>
          </div>

          {/* State Selector */}
          <div>
            <label htmlFor="geo-state-select" className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1 font-semibold">
              {t.thState}
            </label>
            <select
              id="geo-state-select"
              value={selectedStateId}
              onChange={(e) => {
                setSelectedStateId(e.target.value)
                setSelectedMarketId('ALL')
              }}
              className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t.allStates}</option>
              {data.states.map((s) => (
                <option key={s.id} value={s.id}>
                  {isAr ? s.name_ar : s.name_en} ({s.observationCount > 0 ? `${s.observationCount} obs` : '0 obs'})
                </option>
              ))}
            </select>
          </div>

          {/* Market Selector */}
          <div>
            <label htmlFor="geo-market-select" className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1 font-semibold">
              {t.thMarket}
            </label>
            <select
              id="geo-market-select"
              value={selectedMarketId}
              onChange={(e) => {
                const mid = e.target.value
                setSelectedMarketId(mid)
                if (mid !== 'ALL') {
                  const m = data.markets.find((x) => x.id === mid)
                  if (m) setSelectedStateId(m.state_id)
                }
              }}
              className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t.allMarkets} ({data.summary.marketsRepresented} active)</option>
              {data.markets
                .filter((m) => selectedStateId === 'ALL' || m.state_id === selectedStateId)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {isAr ? m.name_ar : m.name_en} {m.observationCount > 0 ? `(${m.observationCount} obs)` : '(0 obs)'}
                  </option>
                ))}
            </select>
          </div>

          {/* Commodity Selector */}
          <div>
            <label htmlFor="geo-commodity-select" className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1 font-semibold">
              {t.trackedCommodities}
            </label>
            <select
              id="geo-commodity-select"
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t.allCommodities}</option>
              {data.commodities.map((c) => (
                <option key={c.code} value={c.name_en}>
                  {c.name_en} ({c.observationCount} obs)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Toolbar Actions */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-border/60 text-xs text-muted">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-text">{t.activeFilters}:</span>
            {selectedStateId !== 'ALL' && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded font-mono text-[11px]">
                {activeState ? (isAr ? activeState.name_ar : activeState.name_en) : selectedStateId}
                <button
                  type="button"
                  onClick={() => setSelectedStateId('ALL')}
                  className="hover:opacity-75"
                  aria-label="Remove state filter"
                >
                  ×
                </button>
              </span>
            )}
            {selectedMarketId !== 'ALL' && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded font-mono text-[11px]">
                {activeMarket ? (isAr ? activeMarket.name_ar : activeMarket.name_en) : selectedMarketId}
                <button
                  type="button"
                  onClick={() => setSelectedMarketId('ALL')}
                  className="hover:opacity-75"
                  aria-label="Remove market filter"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCommodity !== 'ALL' && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded font-mono text-[11px]">
                {selectedCommodity}
                <button
                  type="button"
                  onClick={() => setSelectedCommodity('ALL')}
                  className="hover:opacity-75"
                  aria-label="Remove commodity filter"
                >
                  ×
                </button>
              </span>
            )}
            {(selectedStateId !== 'ALL' || selectedMarketId !== 'ALL' || selectedCommodity !== 'ALL') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-primary hover:underline font-bold text-[11px] ml-1"
              >
                {t.resetFilters}
              </button>
            )}
          </div>

          {/* Informational Scheme Layer Toggle */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-muted hover:text-text">
              <input
                type="checkbox"
                checked={showSchemes}
                onChange={(e) => setShowSchemes(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>{t.legendIrrigated} / {t.legendRainfed}</span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Main Explorer Grid (Map View or Accessible Data Table) */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* MAP CANVAS (8 Columns on Desktop) */}
          <div className="lg:col-span-8 bg-surface-canvas border-2 border-border-strong rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden flex flex-col">
            {/* Top Bar on Map */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text">
                  {activeLayer === 'markets' && t.layerMarkets}
                  {activeLayer === 'coverage' && t.layerCoverage}
                  {activeLayer === 'weather' && t.layerWeather}
                </span>
              </div>
              <div className="text-[11px] font-mono text-muted">
                {visibleMapMarkets.length} {t.marketsRepresented} ({data.summary.totalPublishedObservations} {t.publishedObservations})
              </div>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="relative w-full aspect-[520/453] max-h-[620px] mx-auto select-none">
              <svg
                viewBox="0 0 520 453"
                style={{ direction: 'ltr' }}
                className="w-full h-full drop-shadow-sm"
                role="img"
                aria-label={t.title}
              >
                <defs>
                  {/* Subtle Grid */}
                  <pattern id="geo-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-border-strong opacity-25"
                    />
                  </pattern>

                  {/* Pin Drop Shadow */}
                  <filter id="pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.35" />
                  </filter>
                </defs>

                {/* Grid Background */}
                <rect width="100%" height="100%" fill="url(#geo-grid)" />

                {/* Watermarks */}
                <text x="10" y="442" className="fill-muted/70 font-mono text-[8px]">
                  15.5007° N, 32.5599° E • WGS84 EQUIRECTANGULAR
                </text>
                <text x="400" y="16" className="fill-muted/70 font-mono text-[8px]">
                  ZARATI SOVEREIGN GEOGRAPHY V1
                </text>

                {/* SUDAN BASE VECTOR OUTLINE */}
                <path
                  d={SUDAN_PATH}
                  fill={activeLayer === 'coverage' ? '#F4F1EA' : '#F8F9FA'}
                  stroke="var(--color-border-strong)"
                  strokeWidth="1.8"
                  className="transition-colors duration-300"
                />

                {/* INFORMATIONAL AGRO-ECOLOGICAL SCHEME ZONES */}
                {showSchemes && (
                  <>
                    {/* Gezira Irrigated Scheme Polygon */}
                    <polygon
                      points="329.6,236.5 334,285 345,305 358,271 345,250"
                      fill="#166534"
                      fillOpacity="0.15"
                      stroke="#166534"
                      strokeWidth="1"
                      strokeDasharray="3 2"
                    />
                    <text
                      x="345"
                      y="275"
                      textAnchor="middle"
                      className="fill-success text-[7px] font-mono font-bold select-none opacity-85"
                    >
                      GEZIRA SCHEME
                    </text>

                    {/* Gedaref Mechanized Rainfed Polygon */}
                    <polygon
                      points="415.0,281.8 425,295 405,315 390,290"
                      fill="#D97706"
                      fillOpacity="0.15"
                      stroke="#D97706"
                      strokeWidth="1"
                      strokeDasharray="3 2"
                    />
                    <text
                      x="408"
                      y="300"
                      textAnchor="middle"
                      className="fill-warning text-[7px] font-mono font-bold select-none opacity-85"
                    >
                      GEDAREF VERTISOLS
                    </text>
                  </>
                )}

                {/* NILE HYDROLOGICAL NETWORK */}
                <path d={NILE_WHITE} stroke="#2563EB" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.75" />
                <path d={NILE_BLUE} stroke="#2563EB" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.85" />
                <path d={NILE_MAIN} stroke="#1D4ED8" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9" />
                <path d={NILE_ATBARA} stroke="#3B82F6" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" strokeDasharray="3 2" />
                <path d={KHOR_GASH} stroke="#0D9488" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" strokeDasharray="2 2" />

                {/* River Labels */}
                <text x="320" y="215" className="fill-blue-700 text-[6.5px] font-mono font-semibold opacity-70">Main Nile</text>
                <text x="375" y="315" className="fill-blue-700 text-[6.5px] font-mono font-semibold opacity-70">Blue Nile</text>
                <text x="325" y="325" className="fill-blue-700 text-[6.5px] font-mono font-semibold opacity-70">White Nile</text>

                {/* WEATHER HIGHLIGHT LAYER (When weather layer or Gedaref focused) */}
                {(activeLayer === 'weather' || selectedMarketId === '9ef2994d-980a-4615-befe-a2b06746dc24') && (
                  <g className="animate-pulse">
                    <circle
                      cx="415.0"
                      cy="281.8"
                      r="22"
                      fill="#3B82F6"
                      fillOpacity="0.12"
                      stroke="#3B82F6"
                      strokeWidth="0.75"
                    />
                    <circle
                      cx="415.0"
                      cy="281.8"
                      r="14"
                      fill="#3B82F6"
                      fillOpacity="0.2"
                      stroke="#2563EB"
                      strokeWidth="1"
                    />
                  </g>
                )}

                {/* INTERACTIVE MARKET MARKERS */}
                {visibleMapMarkets.map((m) => {
                  const coord = m.coordinates!
                  const isSelected = selectedMarketId === m.id
                  const isHovered = hoveredMarket?.id === m.id
                  const hasObs = m.observationCount > 0

                  // Colors: Verified with obs = deep green; limited = warm gold; weather station = blue tint
                  let pinFill = hasObs ? '#15803D' : '#94A3B8'
                  if (m.hasWeather) pinFill = '#0F766E'
                  if (isSelected) pinFill = '#1E3A8A'

                  // Label coordinates and text anchoring
                  const flipLabel = coord.svgX > 380
                  const labelX = flipLabel ? coord.svgX - 10 : coord.svgX + 10
                  const textAnchor = flipLabel ? 'end' : 'start'

                  return (
                    <g
                      key={m.id}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleSelectMarket(m)}
                      onMouseEnter={() => setHoveredMarket(m)}
                      onMouseLeave={() => setHoveredMarket(null)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${m.name_en}, ${m.observationCount} observations`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSelectMarket(m)
                        }
                      }}
                    >
                      {/* Outer Focus Ring if selected */}
                      {isSelected && (
                        <circle
                          cx={coord.svgX}
                          cy={coord.svgY}
                          r="12"
                          fill="none"
                          stroke="#1D4ED8"
                          strokeWidth="2"
                          strokeDasharray="2 2"
                          className="animate-spin"
                          style={{ transformOrigin: `${coord.svgX}px ${coord.svgY}px`, animationDuration: '6s' }}
                        />
                      )}

                      {/* Pin Outer Halo */}
                      <circle
                        cx={coord.svgX}
                        cy={coord.svgY}
                        r={isSelected || isHovered ? 8 : 6}
                        fill={pinFill}
                        fillOpacity="0.2"
                        className="transition-all duration-200"
                      />

                      {/* Pin Center */}
                      <circle
                        cx={coord.svgX}
                        cy={coord.svgY}
                        r={isSelected ? 5 : isHovered ? 4.5 : 3.5}
                        fill={pinFill}
                        stroke="#FFFFFF"
                        strokeWidth="1.2"
                        filter="url(#pin-shadow)"
                        className="transition-all duration-200"
                      />

                      {/* Weather Icon / Badge on Gedaref */}
                      {m.hasWeather && (
                        <g transform={`translate(${coord.svgX + 5}, ${coord.svgY - 14})`}>
                          <rect
                            x="-1"
                            y="-1"
                            width="28"
                            height="11"
                            rx="3"
                            fill="#0284C7"
                            stroke="#FFFFFF"
                            strokeWidth="0.8"
                          />
                          <text
                            x="13"
                            y="7"
                            textAnchor="middle"
                            className="fill-white font-mono text-[6.5px] font-bold select-none"
                          >
                            🌦️ {data.weather ? `${Math.round(data.weather.temperature_celsius)}°C` : 'MET'}
                          </text>
                        </g>
                      )}

                      {/* Observation Count Badge for active markets */}
                      {hasObs && !m.hasWeather && (
                        <g transform={`translate(${coord.svgX + 4}, ${coord.svgY - 12})`}>
                          <rect
                            x="-1"
                            y="-1"
                            width="20"
                            height="10"
                            rx="2.5"
                            fill="#15803D"
                            stroke="#FFFFFF"
                            strokeWidth="0.6"
                          />
                          <text
                            x="9"
                            y="6.5"
                            textAnchor="middle"
                            className="fill-white font-mono text-[6px] font-bold select-none"
                          >
                            {m.observationCount}
                          </text>
                        </g>
                      )}

                      {/* Market Name Label */}
                      <text
                        x={labelX}
                        y={coord.svgY + 3}
                        textAnchor={textAnchor}
                        className={`text-[7.5px] font-sans transition-all duration-200 select-none ${
                          isSelected
                            ? 'font-bold fill-blue-900 drop-shadow-sm'
                            : isHovered
                            ? 'font-bold fill-text'
                            : 'font-semibold fill-text/80'
                        }`}
                      >
                        {isAr ? m.name_ar : m.name_en}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Map Legend Footer */}
            <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-4 text-[11px] text-muted">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block border border-white shadow-sm" />
                  <span>{t.legendVerifiedMarket}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block border border-white shadow-sm" />
                  <span>{t.legendWeatherMarket}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-1 bg-blue-600 inline-block rounded" />
                  <span>{t.legendNile}</span>
                </div>
                {showSchemes && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-2 bg-emerald-800/20 border border-dashed border-emerald-700 inline-block rounded-sm" />
                      <span>{t.legendIrrigated}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-2 bg-amber-700/20 border border-dashed border-amber-600 inline-block rounded-sm" />
                      <span>{t.legendRainfed}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="font-mono text-[10px] text-muted">
                WGS84 • PROJECTION D29.8
              </div>
            </div>

            {/* Scheme Disclaimer */}
            <div className="mt-2 text-[10px] text-muted/80 bg-surface-elevated/50 p-2 rounded border border-border/50">
              {t.schemeDisclaimer}
            </div>
          </div>

          {/* CONTEXT / DETAIL PANEL (4 Columns on Desktop) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Panel State 1: Gedaref Market (Market + Weather Combined Context) */}
            {activeMarket && activeMarket.hasWeather ? (
              <div className="bg-surface-canvas border-2 border-primary/40 rounded-2xl p-6 shadow-sm space-y-5">
                {/* Header */}
                <div className="border-b border-border pb-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-primary/10 text-primary border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono rounded">
                      {t.statusVerified}
                    </span>
                    <button
                      onClick={() => setSelectedMarketId('ALL')}
                      className="text-xs text-muted hover:text-text font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-text pt-1">
                    {isAr ? activeMarket.name_ar : activeMarket.name_en}
                  </h2>
                  <p className="text-xs text-muted font-medium">
                    {isAr ? activeMarket.city_ar : activeMarket.city_en}, {isAr ? activeMarket.state_name_ar : activeMarket.state_name_en}
                  </p>
                  <div className="text-[10px] font-mono text-muted pt-1">
                    {t.coordinatePrecision}: {t.precApprox} (14.04°N, 35.38°E)
                  </div>
                </div>

                {/* Market Intelligence Data */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted font-medium">{t.publishedObservations}:</span>
                    <span className="font-bold font-mono text-text">{activeMarket.observationCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted font-medium">{t.trackedCommodities}:</span>
                    <span className="font-bold text-text">
                      {activeMarket.commodities.map((c) => `${c.name_en} (${c.count})`).join(', ')}
                    </span>
                  </div>

                  {activeMarket.latestNormalizedPrice && (
                    <div className="bg-surface-elevated p-3 rounded-lg border border-border space-y-2">
                      <div className="text-[11px] font-mono font-bold uppercase text-primary">
                        {activeMarket.latestNormalizedPrice.crop_name_en} • {t.latestObservation}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-[10px] text-muted uppercase">{t.sourcePrice}</div>
                          <div className="font-bold font-mono text-text">
                            {activeMarket.latestNormalizedPrice.raw_price_text} SDG / {activeMarket.latestNormalizedPrice.raw_unit_text}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted uppercase">{t.normalizedSdgMt}</div>
                          <div className="font-bold font-mono text-success">
                            {activeMarket.latestNormalizedPrice.sdg_per_mt
                              ? `${Math.round(activeMarket.latestNormalizedPrice.sdg_per_mt).toLocaleString()} SDG`
                              : '-'}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-muted font-mono pt-1 border-t border-border/50 flex justify-between">
                        <span>{t.observationDate}: {activeMarket.latestNormalizedPrice.date}</span>
                        <span className="text-muted/70">{t.verifiedFxUnavailable}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Weather Context (MET Norway) */}
                {data.weather && (
                  <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🌦️</span>
                        <span className="text-xs font-bold text-sky-800 font-mono uppercase">
                          {t.forecast} • MET NORWAY
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-sky-700">
                        {data.weather.valid_time ? new Date(data.weather.valid_time).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-white/60 p-2 rounded border border-sky-200">
                        <div className="text-[10px] text-muted uppercase">{t.temp}</div>
                        <div className="text-lg font-bold font-mono text-text">
                          {data.weather.temperature_celsius}°C
                        </div>
                      </div>
                      <div className="bg-white/60 p-2 rounded border border-sky-200">
                        <div className="text-[10px] text-muted uppercase">{t.precip}</div>
                        <div className="text-lg font-bold font-mono text-text">
                          {data.weather.precipitation_mm} mm
                        </div>
                      </div>
                      <div className="bg-white/60 p-2 rounded border border-sky-200">
                        <div className="text-[10px] text-muted uppercase">{t.humidity}</div>
                        <div className="text-lg font-bold font-mono text-text">
                          {data.weather.relative_humidity_percent}%
                        </div>
                      </div>
                      <div className="bg-white/60 p-2 rounded border border-sky-200">
                        <div className="text-[10px] text-muted uppercase">{t.wind}</div>
                        <div className="text-lg font-bold font-mono text-text">
                          {data.weather.wind_speed_kmh} km/h
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-sky-900 leading-snug">
                      {t.weatherContextNote}
                    </p>
                    <div className="text-[9px] text-muted font-mono pt-1">
                      {t.weatherAttribution}
                    </div>
                  </div>
                )}
              </div>
            ) : activeMarket ? (
              /* Panel State 2: Selected Other Market (e.g. El Obeid, Kosti, or reference market) */
              <div className="bg-surface-canvas border-2 border-border-strong rounded-2xl p-6 shadow-sm space-y-5">
                <div className="border-b border-border pb-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono rounded border ${
                        activeMarket.coverageStatus === 'VERIFIED'
                          ? 'bg-success/10 text-success border-success/30'
                          : activeMarket.coverageStatus === 'LIMITED'
                          ? 'bg-warning/10 text-warning border-warning/30'
                          : 'bg-surface-elevated text-muted border-border'
                      }`}
                    >
                      {activeMarket.coverageStatus === 'VERIFIED' && t.statusVerified}
                      {activeMarket.coverageStatus === 'LIMITED' && t.statusLimited}
                      {activeMarket.coverageStatus === 'NO_DATA' && t.statusNoData}
                    </span>
                    <button
                      onClick={() => setSelectedMarketId('ALL')}
                      className="text-xs text-muted hover:text-text font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-text pt-1">
                    {isAr ? activeMarket.name_ar : activeMarket.name_en}
                  </h2>
                  <p className="text-xs text-muted font-medium">
                    {isAr ? activeMarket.city_ar : activeMarket.city_en}, {isAr ? activeMarket.state_name_ar : activeMarket.state_name_en}
                  </p>
                  <div className="text-[10px] font-mono text-muted pt-1">
                    {t.coordinatePrecision}:{' '}
                    {activeMarket.coordinates
                      ? `${t.precApprox} (${activeMarket.coordinates.latitude}°N, ${activeMarket.coordinates.longitude}°E)`
                      : t.precNone}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted font-medium">{t.publishedObservations}:</span>
                    <span className="font-bold font-mono text-text">{activeMarket.observationCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted font-medium">{t.trackedCommodities}:</span>
                    <span className="font-bold text-text">
                      {activeMarket.commodities.length > 0
                        ? activeMarket.commodities.map((c) => `${c.name_en} (${c.count})`).join(', ')
                        : t.statusNoData}
                    </span>
                  </div>

                  {activeMarket.latestNormalizedPrice ? (
                    <div className="bg-surface-elevated p-3 rounded-lg border border-border space-y-2">
                      <div className="text-[11px] font-mono font-bold uppercase text-primary">
                        {activeMarket.latestNormalizedPrice.crop_name_en} • {t.latestObservation}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-[10px] text-muted uppercase">{t.sourcePrice}</div>
                          <div className="font-bold font-mono text-text">
                            {activeMarket.latestNormalizedPrice.raw_price_text} SDG / {activeMarket.latestNormalizedPrice.raw_unit_text}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted uppercase">{t.normalizedSdgMt}</div>
                          <div className="font-bold font-mono text-success">
                            {activeMarket.latestNormalizedPrice.sdg_per_mt
                              ? `${Math.round(activeMarket.latestNormalizedPrice.sdg_per_mt).toLocaleString()} SDG`
                              : '-'}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-muted font-mono pt-1 border-t border-border/50 flex justify-between">
                        <span>{t.observationDate}: {activeMarket.latestNormalizedPrice.date}</span>
                        <span className="text-muted/70">{t.verifiedFxUnavailable}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-surface-elevated p-3 rounded-lg border border-dashed border-border text-center text-xs text-muted">
                      {t.noStateDataNote}
                    </div>
                  )}

                  <div className="text-[10px] text-muted border-t border-border pt-2 flex justify-between">
                    <span>{t.dataSource}: {t.wfpSource}</span>
                    <span>{t.marketType}: {activeMarket.market_type}</span>
                  </div>
                </div>
              </div>
            ) : activeState ? (
              /* Panel State 3: Selected State */
              <div className="bg-surface-canvas border-2 border-border-strong rounded-2xl p-6 shadow-sm space-y-5">
                <div className="border-b border-border pb-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono rounded border ${
                        activeState.coverageStatus === 'VERIFIED'
                          ? 'bg-success/10 text-success border-success/30'
                          : activeState.coverageStatus === 'LIMITED'
                          ? 'bg-warning/10 text-warning border-warning/30'
                          : 'bg-surface-elevated text-muted border-border'
                      }`}
                    >
                      {activeState.coverageStatus === 'VERIFIED' && t.statusVerified}
                      {activeState.coverageStatus === 'LIMITED' && t.statusLimited}
                      {activeState.coverageStatus === 'NO_DATA' && t.statusNoData}
                    </span>
                    <button
                      onClick={() => setSelectedStateId('ALL')}
                      className="text-xs text-muted hover:text-text font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-text pt-1">
                    {isAr ? activeState.name_ar : activeState.name_en}
                  </h2>
                  <p className="text-xs text-muted font-medium">
                    {t.capital}: {isAr ? activeState.capital_ar : activeState.capital_en} • {t.region}: {activeState.region}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted font-medium">{t.marketsRepresented}:</span>
                    <span className="font-bold font-mono text-text">{activeState.marketCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted font-medium">{t.publishedObservations}:</span>
                    <span className="font-bold font-mono text-text">{activeState.observationCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted font-medium">{t.trackedCommodities}:</span>
                    <span className="font-bold text-text">
                      {activeState.commodities.length > 0 ? activeState.commodities.join(', ') : t.statusNoData}
                    </span>
                  </div>

                  {activeState.observationCount === 0 && (
                    <div className="bg-surface-elevated p-3 rounded-lg border border-dashed border-border text-xs text-muted leading-relaxed">
                      {t.noStateDataNote}
                    </div>
                  )}

                  {activeState.markets.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-border">
                      <div className="text-[11px] font-mono uppercase text-muted font-bold">
                        {t.thMarket} ({activeState.markets.length})
                      </div>
                      {activeState.markets.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMarketId(m.id)}
                          className="w-full text-left p-2 rounded bg-surface-elevated hover:bg-border/40 border border-border flex items-center justify-between text-xs transition-colors"
                        >
                          <span className="font-semibold text-text">{isAr ? m.name_ar : m.name_en}</span>
                          <span className="font-mono text-muted text-[11px]">
                            {m.observationCount > 0 ? `${m.observationCount} obs` : '0 obs'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Panel State 4: Default National Overview */
              <div className="bg-surface-canvas border-2 border-border-strong rounded-2xl p-6 shadow-sm space-y-5">
                <div className="border-b border-border pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-primary font-bold uppercase block mb-1">
                    {t.badge}
                  </span>
                  <h2 className="text-lg font-bold text-text">{t.nationalOverview}</h2>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    {t.nationalOverviewDesc}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-surface-elevated p-3 rounded-lg border border-border flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-muted uppercase font-mono">{t.publishedObservations}</div>
                      <div className="text-xl font-bold font-mono text-primary">
                        {data.summary.totalPublishedObservations}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-muted uppercase font-mono">{t.trackedCommodities}</div>
                      <div className="text-xl font-bold font-mono text-text">
                        {data.summary.commoditiesCount}
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-elevated p-3 rounded-lg border border-border flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-muted uppercase font-mono">{t.marketsRepresented}</div>
                      <div className="text-xl font-bold font-mono text-text">
                        {data.summary.marketsRepresented} / {data.summary.totalMarketsInRegistry}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-muted uppercase font-mono">{t.statesWithData}</div>
                      <div className="text-xl font-bold font-mono text-text">
                        {data.summary.statesWithData} / {data.summary.totalStates}
                      </div>
                    </div>
                  </div>

                  {data.weather && (
                    <div className="bg-sky-500/10 border border-sky-500/30 p-3 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-sky-900 flex items-center gap-1.5">
                          <span>🌦️</span>
                          <span>{t.activeWeatherStation}</span>
                        </div>
                        <div className="text-[10px] text-muted font-mono mt-0.5">
                          El Gedarif (14.04°N, 35.38°E)
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-sky-800 text-sm">
                        {data.weather.temperature_celsius}°C
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-surface-elevated rounded-lg border border-dashed border-border text-[11px] text-muted leading-relaxed">
                    <p>{t.selectMarketPrompt}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ACCESSIBLE DATA TABLE VIEW */
        <div className="bg-surface-canvas border-2 border-border-strong rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h2 className="text-lg font-bold text-text">{t.viewTable}</h2>
              <p className="text-xs text-muted">{t.nationalOverviewDesc}</p>
            </div>
            <span className="font-mono text-xs text-muted">
              {filteredMarkets.length} {t.thMarket}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-elevated text-muted uppercase text-[10px] font-mono border-b border-border">
                <tr>
                  <th className="p-3 font-bold">{t.thMarket}</th>
                  <th className="p-3 font-bold">{t.thState}</th>
                  <th className="p-3 font-bold">{t.thCommodities}</th>
                  <th className="p-3 font-bold">{t.thObservations}</th>
                  <th className="p-3 font-bold">{t.thLatestPrice}</th>
                  <th className="p-3 font-bold">{t.thLatestDate}</th>
                  <th className="p-3 font-bold">{t.thCoordinates}</th>
                  <th className="p-3 font-bold">{t.thWeather}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMarkets.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => {
                      setSelectedMarketId(m.id)
                      setSelectedStateId(m.state_id)
                      setViewMode('map')
                    }}
                    className="hover:bg-surface-elevated cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold text-text">
                      {isAr ? m.name_ar : m.name_en}
                    </td>
                    <td className="p-3 text-muted">
                      {isAr ? m.state_name_ar : m.state_name_en}
                    </td>
                    <td className="p-3 text-text">
                      {m.commodities.length > 0
                        ? m.commodities.map((c) => `${c.name_en} (${c.count})`).join(', ')
                        : '-'}
                    </td>
                    <td className="p-3 font-mono font-bold text-primary">
                      {m.observationCount}
                    </td>
                    <td className="p-3 font-mono">
                      {m.latestNormalizedPrice?.sdg_per_mt
                        ? `${Math.round(m.latestNormalizedPrice.sdg_per_mt).toLocaleString()} SDG`
                        : '-'}
                    </td>
                    <td className="p-3 font-mono text-muted">
                      {m.latestObservationDate || '-'}
                    </td>
                    <td className="p-3 font-mono text-[10px]">
                      {m.coordinates ? (
                        <span className="text-text">
                          {t.precApprox} ({m.coordinates.latitude}, {m.coordinates.longitude})
                        </span>
                      ) : (
                        <span className="text-muted">{t.precNone}</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[10px]">
                      {m.hasWeather ? (
                        <span className="text-sky-700 font-bold bg-sky-100 px-1.5 py-0.5 rounded">
                          MET NORWAY ({data.weather?.temperature_celsius}°C)
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Production Ground Truth Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-surface-canvas border border-border rounded-xl p-3.5 shadow-sm">
          <div className="text-[10px] font-mono uppercase text-muted font-semibold">{t.publishedObservations}</div>
          <div className="text-2xl font-bold font-mono text-primary mt-1">{data.summary.totalPublishedObservations}</div>
        </div>
        <div className="bg-surface-canvas border border-border rounded-xl p-3.5 shadow-sm">
          <div className="text-[10px] font-mono uppercase text-muted font-semibold">{t.marketsRepresented}</div>
          <div className="text-2xl font-bold font-mono text-text mt-1">{data.summary.marketsRepresented}</div>
        </div>
        <div className="bg-surface-canvas border border-border rounded-xl p-3.5 shadow-sm">
          <div className="text-[10px] font-mono uppercase text-muted font-semibold">{t.statesWithData}</div>
          <div className="text-2xl font-bold font-mono text-text mt-1">{data.summary.statesWithData} / 18</div>
        </div>
        <div className="bg-surface-canvas border border-border rounded-xl p-3.5 shadow-sm">
          <div className="text-[10px] font-mono uppercase text-muted font-semibold">{t.trackedCommodities}</div>
          <div className="text-2xl font-bold font-mono text-text mt-1">{data.summary.commoditiesCount}</div>
        </div>
        <div className="bg-surface-canvas border border-border rounded-xl p-3.5 shadow-sm">
          <div className="text-[10px] font-mono uppercase text-muted font-semibold">{t.activeWeatherStation}</div>
          <div className="text-2xl font-bold font-mono text-sky-700 mt-1">{data.summary.weatherLocationsCount}</div>
        </div>
        <div className="bg-surface-canvas border border-border rounded-xl p-3.5 shadow-sm">
          <div className="text-[10px] font-mono uppercase text-muted font-semibold">{t.latestObservation}</div>
          <div className="text-xs font-bold font-mono text-muted mt-2 truncate">
            {data.summary.latestObservationDate || '-'}
          </div>
        </div>
      </div>

      {/* 5. Editorial Agricultural Landscapes Section */}
      <div className="space-y-6 pt-6 border-t border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm">🌾</span>
            <h2 className="text-2xl font-bold text-text">
              {t.landscapesTitle}
            </h2>
          </div>
          <p className="text-sm text-muted mt-1">
            {t.landscapesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Riverine Irrigated Belt */}
          <div className="bg-surface-canvas border border-border-strong rounded-xl overflow-hidden shadow-sm flex flex-col hover:border-primary/40 transition-colors">
            <div className="relative aspect-[16/10] w-full bg-muted/20">
              <Image
                src="/images/zarati/geography/riverine-floodplain-landscape.jpg"
                alt={t.landscape1Title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-primary font-bold uppercase block mb-1">
                  {t.landscape1Tag}
                </span>
                <h3 className="font-bold text-lg text-text mb-2">
                  {t.landscape1Title}
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  {t.landscape1Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-border text-[10px] font-mono text-muted flex justify-between">
                <span>{t.region}: {t.landscape1Location}</span>
                <span>{t.landscape1Source}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Gedaref Vertisols (Proposed Pilot) */}
          <div className="bg-surface-canvas border border-border-strong rounded-xl overflow-hidden shadow-sm flex flex-col hover:border-primary/40 transition-colors">
            <div className="relative aspect-[16/10] w-full bg-muted/20">
              <Image
                src="/images/zarati/hero/gedaref-fertile-plains.jpg"
                alt={t.landscape2Title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-700 font-bold uppercase block mb-1">
                  {t.landscape2Tag}
                </span>
                <h3 className="font-bold text-lg text-text mb-2">
                  {t.landscape2Title}
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  {t.landscape2Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-border text-[10px] font-mono text-muted flex justify-between">
                <span>{t.region}: {t.landscape2Location}</span>
                <span>{t.landscape2Source}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Gezira Irrigation Network */}
          <div className="bg-surface-canvas border border-border-strong rounded-xl overflow-hidden shadow-sm flex flex-col hover:border-primary/40 transition-colors">
            <div className="relative aspect-[16/10] w-full bg-muted/20">
              <Image
                src="/images/zarati/agriculture/irrigated-gezira-canal.jpg"
                alt={t.landscape3Title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-700 font-bold uppercase block mb-1">
                  {t.landscape3Tag}
                </span>
                <h3 className="font-bold text-lg text-text mb-2">
                  {t.landscape3Title}
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  {t.landscape3Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-border text-[10px] font-mono text-muted flex justify-between">
                <span>{t.region}: {t.landscape3Location}</span>
                <span>{t.landscape3Source}</span>
              </div>
            </div>
          </div>

          {/* Card 4: North Kordofan Gum Arabic & Savanna */}
          <div className="bg-surface-canvas border border-border-strong rounded-xl overflow-hidden shadow-sm flex flex-col hover:border-primary/40 transition-colors">
            <div className="relative aspect-[16/10] w-full bg-muted/20">
              <Image
                src="/images/zarati/agriculture/traditional-kordofan-rainfed.jpg"
                alt={t.landscape4Title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-800 font-bold uppercase block mb-1">
                  {t.landscape4Tag}
                </span>
                <h3 className="font-bold text-lg text-text mb-2">
                  {t.landscape4Title}
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  {t.landscape4Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-border text-[10px] font-mono text-muted flex justify-between">
                <span>{t.region}: {t.landscape4Location}</span>
                <span>{t.landscape4Source}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Institutional V1 Scope Freeze & R10 Vision Disclaimer */}
      <div className="border border-border/80 bg-surface-elevated p-4 rounded-xl text-xs text-muted flex items-start gap-3">
        <span className="text-base mt-0.5">🏛️</span>
        <div className="space-y-1">
          <div className="font-bold text-text font-mono uppercase text-[11px]">
            ZARATI V1 AGRICULTURAL GEOGRAPHY BASELINE
          </div>
          <p className="leading-relaxed">
            {t.visionDisclaimer}
          </p>
        </div>
      </div>
    </div>
  )
}
