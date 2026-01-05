import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Simple SVG icon
const svgIcon = '<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" fill="#3b82f6"/><circle cx="256" cy="200" r="80" fill="white"/><path d="M256 320 Q180 360 180 420 Q180 480 256 480 Q332 480 332 420 Q332 360 256 320" fill="white"/></svg>';

// Screenshots
const svgNarrow = '<svg width="540" height="720" xmlns="http://www.w3.org/2000/svg"><rect width="540" height="720" fill="#3b82f6"/><rect y="0" width="540" height="120" fill="#1e3a8a"/><text x="270" y="70" font-size="32" font-weight="bold" fill="white" text-anchor="middle">KaloriWater</text><rect x="30" y="160" width="480" height="120" rx="12" fill="white"/><text x="50" y="190" font-size="16" fill="#1e3a8a" font-weight="bold">Daily Water</text><text x="50" y="250" font-size="48" fill="#3b82f6" font-weight="bold">2.5L</text><rect x="30" y="310" width="480" height="120" rx="12" fill="white"/><text x="50" y="340" font-size="16" fill="#1e3a8a" font-weight="bold">Calories</text><text x="50" y="400" font-size="48" fill="#3b82f6" font-weight="bold">1840</text></svg>';

const svgWide = '<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg"><rect width="1280" height="720" fill="#3b82f6"/><rect y="0" width="280" height="720" fill="#1e3a8a"/><text x="140" y="50" font-size="24" font-weight="bold" fill="white" text-anchor="middle">KaloriWater</text><rect x="320" y="60" width="280" height="140" rx="12" fill="white"/><text x="340" y="100" font-size="16" fill="#1e3a8a" font-weight="bold">Water</text><text x="340" y="170" font-size="48" fill="#3b82f6" font-weight="bold">2.5L</text><rect x="640" y="60" width="280" height="140" rx="12" fill="white"/><text x="660" y="100" font-size="16" fill="#1e3a8a" font-weight="bold">Calories</text><text x="660" y="170" font-size="48" fill="#3b82f6" font-weight="bold">1840</text></svg>';

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generate() {
  try {
    console.log('Generating PWA assets...');
    
    // Icons
    for (const size of [32, 96, 192, 512]) {
      const filename = size === 32 ? 'favicon.ico' : `icon-${size}.png`;
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .toFormat('png')
        .toFile(path.join(publicDir, filename));
      console.log(`✓ ${filename}`);
      
      if (size !== 32) {
        await sharp(Buffer.from(svgIcon))
          .resize(size, size)
          .toFormat('png')
          .toFile(path.join(publicDir, `icon-${size}-maskable.png`));
        console.log(`✓ icon-${size}-maskable.png`);
      }
    }
    
    // Screenshots
    await sharp(Buffer.from(svgNarrow))
      .toFormat('png')
      .toFile(path.join(publicDir, 'screenshot-1.png'));
    console.log('✓ screenshot-1.png');
    
    await sharp(Buffer.from(svgWide))
      .toFormat('png')
      .toFile(path.join(publicDir, 'screenshot-2.png'));
    console.log('✓ screenshot-2.png');
    
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

generate();
