import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
const MIN_POPULATION = 50000;

const QUERY = `
[out:json][timeout:60];
area["ISO3166-1"="DE"][admin_level=2]->.de;
(
  node["place"~"^(city|town)$"]["population"](area.de);
);
out tags center;
`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../src/data/cities.json');

const parsePopulation = (raw) => {
  if (!raw) return NaN;
  const n = parseInt(String(raw).replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : NaN;
};

const fetchWithRetry = async (url, init, attempts = 3) => {
  let lastErr;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastErr = err;
      const wait = 5000 * (i + 1);
      console.warn(`  attempt ${i + 1} failed: ${err.message}; retrying in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
};

console.log('Fetching German cities from Overpass...');
const t0 = Date.now();

const res = await fetchWithRetry(OVERPASS_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
    'User-Agent': 'karte-deutschland-prefetch/0.1 (+https://github.com)',
  },
  body: new URLSearchParams({ data: QUERY }),
});
const data = await res.json();

const cities = data.elements
  .map((el) => {
    const pop = parsePopulation(el.tags?.population);
    if (!Number.isFinite(pop) || pop < MIN_POPULATION) return null;
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) return null;
    return {
      id: el.id,
      name: el.tags?.['name:de'] || el.tags?.name || '',
      nameEn: el.tags?.['name:en'] || el.tags?.name || '',
      population: pop,
      lat,
      lon,
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.population - a.population);

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(
  OUTPUT,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: OVERPASS_ENDPOINT,
      minPopulation: MIN_POPULATION,
      cities,
    },
    null,
    2,
  ),
);

console.log(
  `Wrote ${cities.length} cities to ${OUTPUT} in ${((Date.now() - t0) / 1000).toFixed(1)}s.`,
);
