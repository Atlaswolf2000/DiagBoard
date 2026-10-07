# DiagBoard

تطبيق ويب لتشخيص أعطال اللوحات الأم: ربط أجهزة المختبر، تصفية التيليمتري، ثم إسقاط التشخيص على BoardView.

## هيكل المجلدات

```text
src/
  components/
    layout/              Sidebar, TopBar, PlaceholderPanel
    workspace/           بطاقات الاتصال في واجهة الفحص
  config/                عناصر التنقل وقائمة الأجهزة
  layouts/               AppShell (Sidebar + Workspace)
  pages/
    workspace/           T1 واجهة الفحص
    library/             T2 المكتبة (Schematics / Dump / BoardView)
    accounts/            T3 الحسابات
    reports/             T4 التقارير
    access/              T5 الصلاحيات
    insights/            T6 اقتراحات كولد
  services/
    connect/             طبقة اتصال الأجهزة + Heartbeat Guard
    fetch/               Auto-Fetch Engine (لاحقًا)
    parser/              Log Parser (لاحقًا)
    cache/               Semantic Cache (لاحقًا)
    ai/                  حزمة التشخيص ومحرك التحليل (لاحقًا)
    boardview/           إسقاط العطل و Net Track (لاحقًا)
  types/                 عقود التنقل والأجهزة
```

## تشغيل محلي

```bash
npm install
npm run dev
```
