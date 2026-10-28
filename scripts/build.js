import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const item of ['index.html', 'style.css', 'src']) {
  const srcPath = path.join(rootDir, item);
  const destPath = path.join(distDir, item);
  fs.cpSync(srcPath, destPath, { recursive: true });
}

// 自動注入版本號避免瀏覽器與 GitHub Pages CDN 快取舊版 CSS / JS
const versionTag = Date.now().toString(36);
const distIndexPath = path.join(distDir, 'index.html');
let indexHtml = fs.readFileSync(distIndexPath, 'utf-8');
indexHtml = indexHtml
  .replace(/href="\.\/style\.css(\?v=[^"]*)?"/, `href="./style.css?v=${versionTag}"`)
  .replace(/src="\.\/src\/main\.js(\?v=[^"]*)?"/, `src="./src/main.js?v=${versionTag}"`);
fs.writeFileSync(distIndexPath, indexHtml, 'utf-8');

// 建立 .nojekyll 確保 GitHub Pages 原生載入所有靜態資源
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('✅ 靜態網站打包完成！輸出目錄：./dist');

