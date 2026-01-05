# Integration Guide - PWA Components

## 📱 Quick Start

Aplikasi Anda sudah configured sebagai PWA. Sekarang ikuti langkah ini untuk integrate PWA components:

---

## Step 1: Update `src/App.tsx`

Tambahkan komponen PWA di root App component:

```tsx
import { PWAInstallPrompt, PWAUpdatePrompt } from "@/components/PWAComponents";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <>
      {/* PWA Components - Letakkan di root level */}
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
      
      {/* Your existing app content */}
      <YourRouter />
      
      {/* Notifications */}
      <Toaster />
    </>
  );
}
```

---

## Step 2: Create Icon Files

Create icon files dalam folder `public/`:

### Menggunakan Real Favicon Generator:
1. Go to https://realfavicongenerator.net
2. Upload your app logo (1024x1024 recommended)
3. Customize colors
4. Download the favicon package
5. Extract dan copy ke `public/` folder

### Manual Process:
Jika ingin membuat manual, butuh files ini di `public/`:
```
public/
├── favicon.ico
├── apple-touch-icon.png (180x180)
├── icon-96.png (96x96)
├── icon-192.png (192x192)
├── icon-192-maskable.png (192x192)
├── icon-512.png (512x512)
└── icon-512-maskable.png (512x512)
```

### Membuat Maskable Icon:
1. Go to https://maskable.app
2. Upload `icon-512.png`
3. Adjust padding (20% minimum)
4. Download as `icon-512-maskable.png`
5. Repeat untuk icon-192-maskable.png

---

## Step 3: (Optional) Add Screenshots

Create app screenshots untuk app stores:

```
public/
├── screenshot-1.png (540x720 - mobile portrait)
└── screenshot-2.png (1280x720 - desktop landscape)
```

Instruksi screenshot:
1. Use tools like Figma atau Photoshop
2. Add app interface mockup
3. Add text overlay dengan fitur utama
4. Export dengan dimensions tepat
5. Save di `public/` folder

---

## Step 4: Test Locally

```bash
# Build untuk production
npm run build

# Preview build
npm run preview

# Open http://localhost:4173
```

Checklist untuk testing:
- [ ] Manifest loads (DevTools > Application > Manifest)
- [ ] Service Worker registered (DevTools > Application > Service Worker)
- [ ] Icons display
- [ ] Install prompt appears (atau click install in address bar)
- [ ] Works offline (Devtools > Network > Offline, then refresh)

---

## Step 5: Configure Environment Variables

Buat file `.env.local` dengan:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

## Step 6: Deploy on HTTPS

PWA hanya bekerja di HTTPS (kecuali localhost).

Options untuk deploy:

### Option A: Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts
```

### Option B: Netlify
1. Push code ke GitHub
2. Connect repo di https://netlify.com
3. Auto-deploy on push

### Option C: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option D: GitHub Pages
1. Push ke GitHub
2. Enable GitHub Pages di Settings
3. Build & deploy automatic

---

## 📱 Testing Installation

### Chrome Desktop:
1. Click install icon di address bar
2. atau 3-dot menu → Install app

### Android:
1. 3-dot menu → Install app
2. atau from home screen → More options → Install

### iOS:
1. Tap Share button
2. Tap "Add to Home Screen"
3. Name your app
4. Tap Add

### Windows/macOS Desktop:
1. Click install button di address bar
2. atau browser menu

---

## 🔧 Customization

### Change App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name"
}
```

### Change Theme Color
Edit `vite.config.ts` dan `public/manifest.json`:
```json
{
  "theme_color": "#2563eb",
  "background_color": "#f3f4f6"
}
```

### Add App Shortcuts
Edit `public/manifest.json`:
```json
{
  "shortcuts": [
    {
      "name": "Feature Name",
      "short_name": "Feature",
      "description": "Feature description",
      "url": "/feature-path"
    }
  ]
}
```

---

## 🎯 PWA Features Usage

### Show Install Prompt Programmatically

```tsx
import { usePWAInstall } from "@/hooks/use-pwa-install";

function MyButton() {
  const { handleInstallClick, canInstall } = usePWAInstall();
  
  return (
    <button 
      onClick={handleInstallClick}
      disabled={!canInstall}
    >
      Install App
    </button>
  );
}
```

### Check for Updates

```tsx
import { usePWAUpdate } from "@/hooks/use-pwa-update";

function AppFooter() {
  const { updateAvailable } = usePWAUpdate();
  
  return (
    <footer>
      {updateAvailable && (
        <div className="bg-yellow-100 p-2">
          New version available! Refresh to update.
        </div>
      )}
    </footer>
  );
}
```

---

## 🐛 Troubleshooting

### Service Worker Not Registering?
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build

# Check DevTools console for errors
```

### Install Prompt Not Showing?
Requirements untuk install prompt:
- [ ] HTTPS enabled
- [ ] Valid manifest.json
- [ ] Service worker registered
- [ ] User spent 30+ seconds in app (atau triggered manually)
- [ ] Not already installed

### Icons Not Showing?
- Check DevTools > Application > Manifest
- Verify icon paths in manifest.json
- Ensure files exist in `public/` folder
- Check file permissions

### Offline Not Working?
- Check Service Worker in DevTools
- Look for errors in Service Worker logs
- Ensure routes cached properly
- Test with DevTools > Network > Offline

---

## 📊 Lighthouse Audit

Generate Lighthouse report:
1. DevTools > Lighthouse tab
2. Select "Progressive Web App"
3. Run audit
4. Target score: 90+

Top issues to fix:
- [ ] Manifest configured
- [ ] Icons provided (192x192, 512x512)
- [ ] Service worker responds
- [ ] Redirects HTTP to HTTPS
- [ ] Has viewport meta tag

---

## 📝 Files Created/Modified

### Created Files:
- ✅ `src/service-worker.ts` - Service Worker logic
- ✅ `src/hooks/use-pwa-install.ts` - Install hook
- ✅ `src/hooks/use-pwa-update.ts` - Update hook
- ✅ `src/components/PWAComponents.tsx` - UI components
- ✅ `public/manifest.json` - PWA manifest
- ✅ `PWA_SETUP.md` - Detailed documentation
- ✅ `PWA_CHECKLIST.md` - Implementation checklist
- ✅ `INTEGRATION_GUIDE.md` - This file

### Modified Files:
- ✅ `package.json` - Added vite-plugin-pwa
- ✅ `vite.config.ts` - Configured PWA plugin
- ✅ `index.html` - Added PWA meta tags

---

## ✅ Completion Checklist

- [ ] Read PWA_SETUP.md
- [ ] Added icons to `public/` folder
- [ ] Updated `src/App.tsx` with PWA components
- [ ] Created `.env.local` file
- [ ] Tested locally with `npm run preview`
- [ ] Verified DevTools Application tab
- [ ] Deployed to HTTPS
- [ ] Tested installation on device
- [ ] Tested offline functionality
- [ ] Run Lighthouse audit

---

## 🎉 Done!

Selamat! Aplikasi Anda sekarang adalah PWA yang fully functional.

**Next steps:**
1. Monitor user installations
2. Keep service worker updated
3. Gather user feedback
4. Implement additional PWA features (push notifications, etc.)

---

**Questions or Issues?**
- Check PWA_SETUP.md
- Review PWA_CHECKLIST.md
- Visit https://web.dev/progressive-web-apps/
- Check DevTools console for errors

---

Last Updated: December 6, 2025
