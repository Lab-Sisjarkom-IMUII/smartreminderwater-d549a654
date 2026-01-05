# PWA Setup Documentation - KaloriWater

## Status: ✅ Aplikasi Sekarang Sudah PWA!

Aplikasi KaloriWater telah dikonfigurasi sebagai Progressive Web App (PWA) dengan semua fitur yang diperlukan.

---

## 🎯 Komponen PWA yang Ditambahkan

### 1. **Service Worker** (`src/service-worker.ts`)
- Caching strategy untuk static assets (CSS, JS)
- Image caching dengan expiration 30 hari
- API response caching dengan NetworkFirst strategy
- Navigation routing untuk SPA

### 2. **Manifest File** (`public/manifest.json`)
- Informasi aplikasi (nama, deskripsi, icon)
- App shortcuts (Dashboard, Add Water, AI Chat)
- Screenshot untuk app store
- Theme colors dan icons

### 3. **Vite Plugin PWA** (`vite.config.ts`)
- Konfigurasi PWA dengan vite-plugin-pwa
- Workbox integration untuk caching
- Asset precaching dan cleanup
- Development mode support

### 4. **Meta Tags & Links** (`index.html`)
- PWA meta tags untuk iOS dan Android
- Apple touch icon
- Manifest link
- Theme color

### 5. **Install Hook** (`src/hooks/use-pwa-install.ts`)
- Handle `beforeinstallprompt` event
- Custom install button
- User choice tracking

### 6. **Update Hook** (`src/hooks/use-pwa-update.ts`)
- Detect service worker updates
- Periodic update check
- Update notification

### 7. **PWA Components** (`src/components/PWAComponents.tsx`)
- `<PWAInstallPrompt />` - Install dialog
- `<PWAUpdatePrompt />` - Update notification

---

## 🚀 Cara Menggunakan

### Install Packages
```bash
bun install
# atau
npm install
# atau
yarn install
```

### Build for Production
```bash
bun run build
# atau
npm run build
```

### Preview Build
```bash
bun run preview
# atau
npm run preview
```

---

## 📱 Integrasi di App Component

Tambahkan komponen PWA di `src/App.tsx`:

```tsx
import { PWAInstallPrompt, PWAUpdatePrompt } from "@/components/PWAComponents";

export default function App() {
  return (
    <>
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
      {/* Rest of your app */}
    </>
  );
}
```

---

## 🔧 Fitur PWA yang Tersedia

### ✅ Install sebagai App
- Pengguna bisa install aplikasi tanpa melalui app store
- Works on iOS, Android, Windows, macOS

### ✅ Offline Support
- Static assets di-cache
- Dapat diakses offline jika pernah diakses sebelumnya
- API responses di-cache dengan timeout 3 detik

### ✅ App Shortcuts
- Dashboard - Akses langsung ke dashboard
- Add Water - Langsung ke halaman input air
- AI Chat - Akses ke AI assistant

### ✅ Auto Update
- Service worker otomatis check update setiap jam
- Notifikasi ke user saat ada update baru
- User bisa update dengan satu klik

### ✅ Push Notifications Ready
- Service worker siap untuk push notifications
- Dapat mengirim notifikasi ke user

### ✅ Responsive Design
- Works di semua ukuran layar
- Optimized untuk mobile-first experience

---

## 🖼️ Aseets yang Diperlukan

Letakkan icon berikut di folder `public/`:

```
public/
├── favicon.ico              (32x32)
├── apple-touch-icon.png     (180x180)
├── icon-192.png             (192x192)
├── icon-192-maskable.png    (192x192, dengan padding)
├── icon-512.png             (512x512)
├── icon-512-maskable.png    (512x512, dengan padding)
├── icon-96.png              (96x96, untuk shortcuts)
├── screenshot-1.png         (540x720, narrow)
├── screenshot-2.png         (1280x720, wide)
└── manifest.json            (auto-generated)
```

**Note:** Icon dengan `-maskable` suffix harus memiliki padding minimal 20% dari ukuran canvas.

### 🎨 Membuat Icon PNG

Gunakan tools ini:
1. **Figma** - Design dan export
2. **TinyPNG** - Compress icon
3. **Real Favicon Generator** - Generate set dari 1 icon
4. **Maskable.app** - Buat maskable icon

---

## 📊 Testing PWA

### Di Chrome DevTools:
1. Buka DevTools (F12)
2. Aplikasi → Manifest
3. Lihat manifest.json loaded dengan benar
4. Periksa service worker di tab Service Worker

### Test Install:
- Klik 3 dot menu → "Install KaloriWater"
- atau Trigger install prompt dari PWAInstallPrompt component

### Test Offline:
1. Di DevTools → Network tab
2. Centang "Offline"
3. Refresh halaman - harus bisa diakses

---

## 🔐 Best Practices

1. **HTTPS Required** - PWA hanya bekerja di HTTPS (kecuali localhost)
2. **Valid Manifest** - Pastikan semua field terisi dengan benar
3. **Icons** - Provide multiple sizes untuk compatibility
4. **Service Worker** - Keep it lightweight
5. **Caching** - Jangan cache API responses yang sering berubah
6. **Testing** - Test di real device dan browser terbaru

---

## 📝 Environment Files

Pastikan `.env` atau `.env.local` sudah dikonfigurasi dengan:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🐛 Troubleshooting

### Service Worker tidak register?
- Pastikan app di HTTPS (atau localhost)
- Check DevTools Console untuk error
- Clear cache dan hard refresh (Ctrl+Shift+R)

### Install prompt tidak muncul?
- PWA requirements:
  - Manifest valid
  - Service worker registered
  - HTTPS connection
  - 2 min spent di app (atau user trigger install)

### Icons tidak muncul?
- Check path di manifest.json
- Pastikan file exist di `public/`
- Gunakan relative paths (e.g., `/icon-192.png`)

---

## 📚 Reference

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

---

## ✨ Fitur Tambahan yang Bisa Ditambah

- [ ] Background Sync (sync data saat online)
- [ ] Push Notifications
- [ ] Periodic Background Sync
- [ ] Web Share API
- [ ] Geolocation API
- [ ] Camera/Microphone access
- [ ] Local Storage optimization

---

**Last Updated:** December 6, 2025
**Status:** ✅ PWA Ready for Production
