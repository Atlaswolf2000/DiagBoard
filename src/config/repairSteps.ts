import type { RepairStep } from '@/types/scan'

export const DEMO_REPAIR_STEPS: RepairStep[] = [
  {
    id: 'step-1',
    part: 'PU8100',
    titleAr: 'قِس جهد 3.3V على PU8100',
    titleEn: 'Measure 3.3V on PU8100',
    detailAr: 'ضع المالتيميتر على مكثف الخرج. إن كان الجهد غائباً انتقل للخطوة التالية.',
    detailEn: 'Probe the output capacitor. If 3.3V is missing, continue to the next step.',
    x: 28,
    y: 36,
  },
  {
    id: 'step-2',
    part: 'PQ8102',
    titleAr: 'افحص MOSFET PQ8102',
    titleEn: 'Check MOSFET PQ8102',
    detailAr: 'ابحث عن شورت بين Drain و Source. إن وُجد الشورت استبدل القطعة.',
    detailEn: 'Check Drain-Source short. Replace the part if a short is found.',
    x: 46,
    y: 52,
  },
  {
    id: 'step-3',
    part: 'PL8100',
    titleAr: 'تتبع مسار الملف PL8100',
    titleEn: 'Trace coil PL8100',
    detailAr: 'تأكد من استمرارية الملف وعدم وجود حرارة زائدة حوله.',
    detailEn: 'Verify coil continuity and check for overheating around it.',
    x: 62,
    y: 41,
  },
  {
    id: 'step-4',
    part: 'U8100',
    titleAr: 'أعد الفحص بعد الاستبدال',
    titleEn: 'Re-scan after replacement',
    detailAr: 'بعد تبديل القطعة اضغط زر الفحص مجدداً لتأكيد عودة الجهد.',
    detailEn: 'After replacing the part, run Scan again to confirm voltage is back.',
    x: 74,
    y: 63,
  },
]
