// نسخة الآيفون: يحفظ ملفات التطبيق على الهاتف فيعمل بلا إنترنت. يُكتب تلقائياً (tool/build_iphone.dart).
const VERSION = 'f282bfa1';
const CACHE = 'mazraati-' + VERSION;
const FILES = ["./",".last_build_id","assets/AssetManifest.bin","assets/AssetManifest.bin.json","assets/FontManifest.json","assets/NOTICES","assets/assets/fonts/cairo/Cairo-Variable.ttf","assets/assets/fonts/tajawal/Tajawal-Bold.ttf","assets/assets/fonts/tajawal/Tajawal-Medium.ttf","assets/assets/fonts/tajawal/Tajawal-Regular.ttf","assets/assets/seed/farm-data.json","assets/assets/seed/hedges.json","assets/fonts/MaterialIcons-Regular.otf","assets/fonts/fallback/Roboto-Regular.ttf","assets/packages/flutter_local_notifications_web/web/notifications_service_worker.js","assets/packages/flutter_map/lib/assets/flutter_map_logo.png","assets/shaders/ink_sparkle.frag","assets/shaders/stretch_effect.frag","canvaskit/canvaskit.js","canvaskit/canvaskit.wasm","canvaskit/chromium/canvaskit.js","canvaskit/chromium/canvaskit.wasm","favicon.png","flutter.js","flutter_bootstrap.js","icons/Icon-192.png","icons/Icon-512.png","icons/Icon-maskable-192.png","icons/Icon-maskable-512.png","icons/apple-touch-icon.png","index.html","main.dart.js","manifest.json","version.json"];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(FILES.map((f) => new Request(f, {cache: 'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) {
      if (k.startsWith('mazraati-') && k !== CACHE) await caches.delete(k);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // الطقس وصور الأقمار الصناعية من الإنترنت مباشرة، لا تُحفظ هنا
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // الصفحة نفسها: من الإنترنت إن أمكن (حتى يصل التحديث)، وإلا المحفوظة
    e.respondWith(fetch(req).catch(async () => (await caches.match('./', {ignoreSearch: true})) || Response.error()));
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req, {ignoreSearch: true});
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
    return res;
  })());
});
