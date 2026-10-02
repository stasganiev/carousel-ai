// Экспорт слайдов карусели из HTML в PNG для Instagram + автопроверка вёрстки.
//
// Установка не нужна: библиотека playwright-core лежит рядом, в node_modules этого скилла.
// Нужны только Node.js и любой установленный браузер: Chrome, Edge или Chromium.
// Скрипт ничего не скачивает и ничего не пишет за пределы папки вывода.
//
// Запуск (из рабочей папки проекта):
//   node <папка этого скилла>/export-slides.mjs <путь-к-html> [папка-вывода]
//
// Браузер ищется по порядку: Chrome, Edge, Chromium из кэша Playwright, chromium/google-chrome из PATH,
// браузер из папки .browsers рядом со скриптом.
// Принудительно: CAROUSEL_BROWSER=chrome | msedge | playwright | <путь к исполняемому файлу>.
//
// Что делает:
//   1. Находит все .slide, рендерит каждый в полный размер и сохраняет slide-01.png, slide-02.png, …
//   2. Проверяет каждый слайд: контент не вылезает, нет слишком мелкого текста, шрифты и картинки загрузились.
//   3. Собирает sheet.png — все слайды на одном листе, чтобы оценить карусель одним взглядом.
//
// Размер слайда: 1080×1350 (4:5). Переопределяется переменными окружения SLIDE_W / SLIDE_H.
// Минимальный кегль для проверки: MIN_FONT (по умолчанию 26px).

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  console.error('НЕТ БИБЛИОТЕКИ: рядом со скриптом нет папки node_modules/playwright-core.');
  console.error('Скилл скопирован не целиком. Верни папку node_modules в папку скилла carousel-png.');
  process.exit(3);
}

const SKILL_DIR = path.dirname(fileURLToPath(import.meta.url));
// Браузер, положенный прямо в папку скилла: нужен средам, где своего браузера нет и скачать его нельзя (песочница Cowork).
const LOCAL_BROWSERS = path.join(SKILL_DIR, '.browsers');
// Системные библиотеки для этого браузера (в минимальных Linux-средах их нет).
const LOCAL_LIBS = path.join(LOCAL_BROWSERS, 'libs-linux64');

// Запускаем первый доступный браузер. Ничего не скачиваем.
async function launchBrowser() {
  const forced = process.env.CAROUSEL_BROWSER;
  const win = process.platform === 'win32';
  const linux = process.platform === 'linux';
  const args = linux ? ['--disable-dev-shm-usage', '--disable-gpu'] : [];
  const exeNames = new Set(win
    ? ['chrome.exe', 'chrome-headless-shell.exe']
    : ['chrome', 'chromium', 'Chromium', 'headless_shell', 'chrome-headless-shell']);
  const find = roots => {
    const found = [];
    const walk = (dir, depth) => {
      if (depth > 6) return;
      let items = [];
      try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const it of items) {
        const p = path.join(dir, it.name);
        if (it.isDirectory()) walk(p, depth + 1);
        else if (exeNames.has(it.name)) found.push(p);
      }
    };
    roots.filter(d => d && fs.existsSync(d)).forEach(d => walk(d, 0));
    return found;
  };
  const fromPath = win ? [] : ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable']
    .flatMap(name => (process.env.PATH || '').split(path.delimiter).map(dir => path.join(dir, name)))
    .filter(p => fs.existsSync(p));
  // Chromium из кэша Playwright любой версии (в облачных песочницах: /opt/pw-browsers).
  const home = process.env.HOME || process.env.USERPROFILE || '';
  const cached = find([process.env.PLAYWRIGHT_BROWSERS_PATH, '/opt/pw-browsers', path.join(home, '.cache', 'ms-playwright'),
    path.join(home, 'Library', 'Caches', 'ms-playwright'), process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'ms-playwright')]);
  const bundled = find([LOCAL_BROWSERS]);

  const candidates = forced
    ? [/^(chrome|msedge)$/.test(forced) ? { channel: forced } : forced === 'playwright' ? {} : { executablePath: forced }]
    : [{ channel: 'chrome' }, { channel: 'msedge' }, {},
       ...[...fromPath, ...bundled, ...cached].map(executablePath => ({ executablePath }))];

  const errors = [];
  const libEnv = dir => ({ ...process.env, LD_LIBRARY_PATH: [dir, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':') });
  const tryLaunch = async (opts, label, env) => {
    try {
      if (opts.executablePath && !win) { try { fs.chmodSync(opts.executablePath, 0o755); } catch { /* файловая система может не разрешать */ } }
      const b = await chromium.launch({ ...opts, args, ...(env ? { env } : {}) });
      console.log('Браузер: ' + label);
      return b;
    } catch (e) {
      const lines = String(e.message || e).split('\n').map(s => s.trim()).filter(Boolean);
      const why = lines.find(s => /shared librar|cannot open|EACCES|ENOENT|Permission denied|not found|GLIBC/i.test(s)) || lines[0] || 'неизвестная ошибка';
      errors.push(`${label}: ${why.slice(0, 220)}`);
      // Для Linux-браузера перечисляем все недостающие системные библиотеки разом.
      if (linux && opts.executablePath) {
        try {
          const out = execFileSync('ldd', [opts.executablePath], { env: env || process.env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
          const missing = out.split(/\r?\n/).filter(l => l.includes('not found')).map(l => l.trim().split(' ')[0]);
          if (missing.length) errors.push('    не хватает библиотек: ' + [...new Set(missing)].join(', '));
        } catch { /* ldd недоступен */ }
      }
      return null;
    }
  };

  for (const opts of candidates) {
    const label = opts.channel || opts.executablePath || 'Chromium из кэша Playwright';
    const isBundled = !win && opts.executablePath && opts.executablePath.startsWith(LOCAL_BROWSERS);
    let b = await tryLaunch(opts, label, isBundled && fs.existsSync(LOCAL_LIBS) ? libEnv(LOCAL_LIBS) : undefined);
    // Браузер из папки проекта может лежать на диске, где запуск программ запрещён, — пробуем из временной папки.
    if (!b && isBundled) {
      try {
        const srcDir = path.dirname(opts.executablePath);
        const tmpDir = path.join(os.tmpdir(), 'carousel-browser', path.basename(srcDir));
        if (!fs.existsSync(tmpDir)) fs.cpSync(srcDir, tmpDir, { recursive: true });
        const tmpLibs = path.join(os.tmpdir(), 'carousel-browser', 'libs-linux64');
        if (fs.existsSync(LOCAL_LIBS) && !fs.existsSync(tmpLibs)) fs.cpSync(LOCAL_LIBS, tmpLibs, { recursive: true });
        const exe = path.join(tmpDir, path.basename(opts.executablePath));
        b = await tryLaunch({ executablePath: exe }, exe + ' (копия во временной папке)', fs.existsSync(tmpLibs) ? libEnv(tmpLibs) : undefined);
      } catch (e) { errors.push('копирование во временную папку: ' + String(e.message || e).split('\n')[0]); }
    }
    if (b) return b;
  }
  console.error('БРАУЗЕР НЕ НАЙДЕН: в этой среде нет рабочего Chrome, Edge или Chromium.');
  console.error('Что пробовали:');
  errors.forEach(e => console.error('  — ' + e));
  console.error('Автоматический экспорт невозможен. Сообщи пользователю причину.');
  process.exit(4);
}

const SLIDE_W = Number(process.env.SLIDE_W) || 1080;
const SLIDE_H = Number(process.env.SLIDE_H) || 1350;
const MIN_FONT = Number(process.env.MIN_FONT) || 26;

const htmlArg = process.argv[2];
if (!htmlArg) {
  console.error('Использование: node export-slides.mjs <html> [папка-вывода]');
  process.exit(1);
}
const htmlPath = path.resolve(htmlArg);
if (!fs.existsSync(htmlPath)) {
  console.error('Файл не найден: ' + htmlPath);
  process.exit(1);
}
const outDir = path.resolve(process.argv[3] || path.join(path.dirname(htmlPath), 'png'));
fs.mkdirSync(outDir, { recursive: true });
// старые слайды убираем, чтобы после сокращения карусели не остались лишние файлы
for (const f of fs.readdirSync(outDir)) {
  if (/^slide-\d+\.png$/.test(f) || f === 'sheet.png') fs.unlinkSync(path.join(outDir, f));
}

const browser = await launchBrowser();
const page = await browser.newPage({
  viewport: { width: SLIDE_W, height: SLIDE_H },
  deviceScaleFactor: 1,
});

const failed = [];
const remote = new Set();   // обращения в интернет: карусель должна собираться из локальных файлов
page.on('request', r => { if (/^https?:/.test(r.url())) remote.add(new URL(r.url()).host); });
page.on('requestfailed', r => failed.push(r.url()));
page.on('response', r => { if (r.status() >= 400) failed.push(r.url()); });

await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// Снимаем масштаб превью и позиционирование, чтобы каждый слайд рендерился в полный размер.
await page.addStyleTag({
  content: `
    body { padding:0 !important; margin:0 !important; background:#fff !important; display:block !important; }
    .topbar, .nav { display:none !important; }
    .viewer { width:${SLIDE_W}px !important; height:${SLIDE_H}px !important;
              border-radius:0 !important; box-shadow:none !important; overflow:visible !important; }
    .slide { transform:none !important; position:static !important; display:none !important; }
    .slide.export-on { display:block !important; }
  `,
});

const count = await page.$$eval('.slide', els => els.length);
if (!count) {
  console.error('В файле не найдено ни одного элемента .slide');
  await browser.close();
  process.exit(1);
}

console.log(`Слайдов: ${count}. Экспорт в: ${outDir}`);

const problems = [];
const files = [];

for (let n = 0; n < count; n++) {
  await page.evaluate((idx) => {
    document.querySelectorAll('.slide').forEach((s, j) => s.classList.toggle('export-on', j === idx));
  }, n);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);

  const issues = await page.evaluate(({ W, H, MIN_FONT }) => {
    const out = [];
    const root = document.querySelector('.slide.export-on .s') || document.querySelector('.slide.export-on');
    const R = root.getBoundingClientRect();
    if (Math.round(R.width) !== W || Math.round(R.height) !== H) {
      out.push(`размер слайда ${Math.round(R.width)}×${Math.round(R.height)} вместо ${W}×${H}`);
    }
    // контент не помещается в основную область
    const main = root.querySelector('.main');
    if (main && main.scrollHeight > main.clientHeight + 2) {
      out.push(`контент не помещается по высоте: лишние ${main.scrollHeight - main.clientHeight}px`);
    }
    const seen = new Set();
    for (const el of root.querySelectorAll('*')) {
      if (el.closest('.bg, [data-bleed]')) continue;        // фон и декор могут выходить за край
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const name = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\s+/).join('.') : '');
      if (r.bottom > R.bottom + 1 || r.right > R.right + 1 || r.left < R.left - 1 || r.top < R.top - 1) {
        if (!seen.has('edge' + name)) { seen.add('edge' + name); out.push(`<${name}> выходит за край слайда`); }
      }
      // слово шире своей строки
      if (/^(H1|H2|H3|P|LI)$/.test(el.tagName) && el.scrollWidth > el.clientWidth + 2) {
        out.push(`<${name}> не помещается по ширине: «${el.textContent.trim().slice(0, 30)}…»`);
      }
      // мелкий текст
      const ownText = [...el.childNodes].some(c => c.nodeType === 3 && c.nodeValue.trim());
      if (ownText) {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < MIN_FONT && !seen.has('font' + name)) {
          seen.add('font' + name);
          out.push(`<${name}> мелкий текст ${Math.round(fs)}px (минимум ${MIN_FONT}px)`);
        }
      }
    }
    for (const img of root.querySelectorAll('img')) {
      if (!img.complete || !img.naturalWidth) out.push(`картинка не загрузилась: ${img.getAttribute('src')}`);
    }
    return out;
  }, { W: SLIDE_W, H: SLIDE_H, MIN_FONT });

  const slide = page.locator('.slide.export-on .s');
  const target = (await slide.count()) ? slide : page.locator('.slide.export-on');
  const file = path.join(outDir, `slide-${String(n + 1).padStart(2, '0')}.png`);
  await target.screenshot({ path: file });
  files.push(file);

  if (issues.length) {
    problems.push({ n: n + 1, issues });
    console.log(`  ⚠ ${path.basename(file)}`);
    issues.forEach(i => console.log(`      — ${i}`));
  } else {
    console.log(`  ✓ ${path.basename(file)}`);
  }
}

const fontErrors = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'error').map(f => f.family));
// Шрифты, которыми набран текст слайдов, должны быть подключены и загружены — иначе текст отрисован запасным шрифтом.
const fontMissing = await page.evaluate(() => {
  const clean = s => s.trim().replace(/^['"]|['"]$/g, '');
  const loaded = new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => clean(f.family)));
  const generic = /^(serif|sans-serif|monospace|system-ui|cursive|fantasy)$/;
  const used = new Set();
  for (const el of document.querySelectorAll('.slide .s, .slide .s *')) {
    if ([...el.childNodes].some(c => c.nodeType === 3 && c.nodeValue.trim())) used.add(clean(getComputedStyle(el).fontFamily.split(',')[0]));
  }
  return [...used].filter(f => !generic.test(f) && !loaded.has(f));
});

// Общий лист: все слайды в одной картинке.
const COLS = Math.min(count, 4);
const THUMB = 384;
const GAP = 16;
const sheetW = COLS * THUMB + (COLS + 1) * GAP;
const sheet = await browser.newPage({ viewport: { width: sheetW, height: 600 }, deviceScaleFactor: 1 });
await sheet.setContent(`<!DOCTYPE html><meta charset="utf-8"><style>
  body{margin:0;padding:${GAP}px;background:#222;display:grid;grid-template-columns:repeat(${COLS},${THUMB}px);gap:${GAP}px;
    font:600 14px sans-serif;color:#bbb;}
  figure{margin:0;} img{width:${THUMB}px;display:block;} figcaption{padding:4px 0 0;}
</style>${files.map((f, k) => `<figure><img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}"><figcaption>${k + 1}</figcaption></figure>`).join('')}`);
await sheet.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))));
const sheetFile = path.join(outDir, 'sheet.png');
await sheet.screenshot({ path: sheetFile, fullPage: true });

await browser.close();

console.log(`\nГотово: ${count} PNG ${SLIDE_W}×${SLIDE_H} + sheet.png`);
const badFonts = [...new Set([...fontErrors, ...fontMissing])];
if (badFonts.length) console.log(`⚠ Шрифты не подключены или не загрузились: ${badFonts.join(', ')}. Скопируй их папки в fonts/ рядом с HTML.`);
if (failed.length) console.log(`⚠ Не загрузились ресурсы:\n${[...new Set(failed)].map(u => '   ' + u).join('\n')}`);
if (remote.size) console.log(`⚠ Страница обращается в интернет (${[...remote].join(', ')}). Замени внешние ссылки локальными файлами.`);
if (problems.length) {
  console.log(`⚠ Слайды с проблемами: ${problems.map(p => p.n).join(', ')}. Исправь вёрстку и запусти экспорт заново.`);
} else if (!badFonts.length && !failed.length && !remote.size) {
  console.log('Автопроверка пройдена: переполнений и мелкого текста нет.');
}
