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

// 建立 .nojekyll 確保 GitHub Pages 原生載入所有靜態資源
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('✅ 靜態網站打包完成！輸出目錄：./dist');

