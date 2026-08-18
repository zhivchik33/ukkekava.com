#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const EVENTS_DIR = path.join(__dirname, '../images/events');
const OUTPUT = path.join(__dirname, '../data/gallery-photos.json');

const CATEGORIES = ['culture', 'social', 'education', 'humanitarian', 'psychology', 'civic'];

const CATEGORY_ALIASES = {
  edukation: 'education',
  psychologiy: 'psychology'
};

const WEB_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function getImageWidth(filePath) {
  if (process.platform !== 'darwin') {
    return null;
  }

  try {
    const output = execFileSync('sips', ['-g', 'pixelWidth', filePath], { encoding: 'utf8' });
    const match = output.match(/pixelWidth:\s*(\d+)/);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
}

function convertHeicFiles() {
  if (process.platform !== 'darwin') {
    return;
  }

  for (const file of fs.readdirSync(EVENTS_DIR)) {
    if (!/\.heic$/i.test(file)) {
      continue;
    }

    const base = file.replace(/\.heic$/i, '');
    const jpgPath = path.join(EVENTS_DIR, `${base}.jpg`);
    const heicPath = path.join(EVENTS_DIR, file);
    const heicSize = fs.statSync(heicPath).size;
    const jpgExists = fs.existsSync(jpgPath);
    const jpgSize = jpgExists ? fs.statSync(jpgPath).size : 0;
    const jpgWidth = jpgExists ? getImageWidth(jpgPath) : null;
    const looksLikePreview = jpgWidth !== null && jpgWidth <= 1024;

    if (jpgExists && !looksLikePreview && jpgSize > heicSize * 0.15) {
      continue;
    }

    try {
      execFileSync('sips', ['-s', 'format', 'jpeg', heicPath, '--out', jpgPath], {
        stdio: 'ignore'
      });
      console.log(`Converted ${file} -> ${base}.jpg`);
    } catch (error) {
      console.warn(`Could not convert ${file}: ${error.message}`);
    }
  }
}

convertHeicFiles();

const photos = Object.fromEntries(CATEGORIES.map((category) => [category, {}]));
const grouped = new Map();

for (const file of fs.readdirSync(EVENTS_DIR)) {
  if (file.includes('-cover.')) {
    continue;
  }

  const ext = path.extname(file).toLowerCase();
  if (!WEB_EXTENSIONS.has(ext)) {
    continue;
  }

  const base = file.slice(0, -path.extname(file).length);
  const match = base.match(/^([a-z]+)_(\d{4})_(\d+)$/i);

  if (!match) {
    continue;
  }

  const rawCategory = match[1].toLowerCase();
  const category = CATEGORY_ALIASES[rawCategory] || rawCategory;
  const year = match[2];
  const number = Number(match[3]);

  if (!CATEGORIES.includes(category)) {
    continue;
  }

  const key = `${category}|${year}|${number}`;
  const fullPath = path.join(EVENTS_DIR, file);
  const size = fs.statSync(fullPath).size;
  const candidate = {
    src: `images/events/${file}`,
    size
  };

  const existing = grouped.get(key);
  if (!existing || candidate.size > existing.size) {
    grouped.set(key, candidate);
  }
}

for (const [key, candidate] of grouped.entries()) {
  const [category, year] = key.split('|');
  if (!photos[category][year]) {
    photos[category][year] = [];
  }
  photos[category][year].push({
    src: candidate.src,
    number: Number(key.split('|')[2])
  });
}

for (const category of CATEGORIES) {
  for (const year of Object.keys(photos[category])) {
    photos[category][year]
      .sort((a, b) => a.number - b.number)
      .forEach((photo) => delete photo.number);
  }
}

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify({ photos }, null, 2)}\n`);

const total = Object.values(photos).reduce((sum, byYear) => {
  return sum + Object.values(byYear).reduce((yearSum, items) => yearSum + items.length, 0);
}, 0);

console.log(`Generated ${OUTPUT} with ${total} photos.`);
