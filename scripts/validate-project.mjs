import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const passes = [];
const warnings = [];
const failures = [];
const pass = (message) => passes.push(message);
const warn = (message) => warnings.push(message);
const fail = (message) => failures.push(message);
const clean = (value) =>
  value === null || value === undefined ? "" : String(value).trim();
const file = (path) => join(root, path);
const text = (path) => readFileSync(file(path), "utf8").replace(/^\uFEFF/, "");

function json(path) {
  try {
    const value = JSON.parse(text(path));
    pass(`${path} contains valid JSON.`);
    return value;
  } catch (error) {
    fail(`${path} is not valid JSON: ${error.message}`);
    return [];
  }
}

function csv(source) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (character === '"' && quoted && source[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some(clean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    if (row.some(clean)) rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows.shift().map(clean);
  return rows.map((values) =>
    Object.fromEntries(
      headers.map((header, index) => [header, clean(values[index])])
    )
  );
}

function expectCount(label, records, expected) {
  if (!Array.isArray(records)) {
    fail(`${label} must contain an array.`);
  } else if (records.length !== expected) {
    fail(`${label} has ${records.length} records; expected ${expected}.`);
  } else {
    pass(`${label} has the expected ${expected} records.`);
  }
}

function expectUnique(label, values) {
  const used = new Set();
  const duplicates = new Set();

  values.map(clean).filter(Boolean).forEach((value) => {
    if (used.has(value)) duplicates.add(value);
    used.add(value);
  });

  if (duplicates.size) {
    fail(`${label} contain duplicates: ${[...duplicates].slice(0, 10).join(", ")}`);
  } else {
    pass(`${label} are unique.`);
  }
}

function expectLocalFile(label, path) {
  const normalized = clean(path).replaceAll("\\", "/");
  const resolved = resolve(root, normalized);
  const insideProject =
    resolved === root || resolved.startsWith(`${root}${sep}`);

  if (!normalized || !insideProject) {
    fail(`${label} has an unsafe path: ${normalized || "(empty)"}`);
  } else if (!existsSync(resolved) || !statSync(resolved).isFile()) {
    fail(`${label} points to a missing file: ${normalized}`);
  }
}

const required = [
  "index.html",
  "quotes.html",
  "art.html",
  "movies.html",
  "style.css",
  "quoteapp.js",
  "art-reference.js",
  "movies.js",
  "manifest.json",
  "sw.js",
  "data.json",
  "quotes-source.csv",
  "TAOPROJECT_Master_Table - PWA.csv",
  "art-references.json",
  "images.json"
];
const missing = required.filter((path) => !existsSync(file(path)));

missing.length
  ? fail(`Required files are missing: ${missing.join(", ")}`)
  : pass("All required production files exist.");

const quotes = json("data.json");
const references = json("art-references.json");
const quoteImages = json("images.json");
const manifest = json("manifest.json");
const quoteSource = csv(text("quotes-source.csv"));
const master = csv(text("TAOPROJECT_Master_Table - PWA.csv"));
const movies = master.filter(
  (row) => clean(row.type).toLowerCase() === "movie"
);

expectCount("data.json", quotes, 2000);
expectUnique("Quote IDs", quotes.map((quote) => quote.id));

const incompleteQuotes = quotes.filter(
  (quote) =>
    clean(quote.type) !== "Quote" ||
    !clean(quote.id) ||
    !clean(quote.content) ||
    !clean(quote.creator)
);
incompleteQuotes.length
  ? fail(`${incompleteQuotes.length} quotes lack id, type, content, or creator.`)
  : pass("Every quote has an id, Quote type, content, and creator.");

const quoteMap = [
  ["content", "Quote"],
  ["creator", "Column 7"],
  ["year", "Year"],
  ["category", "Topic"],
  ["subcategory", "Sub-topic"],
  ["source", "From"]
];
let quoteDifferences = Math.abs(quotes.length - quoteSource.length);

quotes.forEach((quote, index) => {
  const source = quoteSource[index] || {};
  if (clean(quote.id) !== String(index + 1)) quoteDifferences += 1;
  quoteMap.forEach(([jsonField, csvField]) => {
    if (clean(quote[jsonField]) !== clean(source[csvField])) {
      quoteDifferences += 1;
    }
  });
});

quoteDifferences
  ? fail(`data.json differs from quotes-source.csv in ${quoteDifferences} places.`)
  : pass("data.json matches all 2,000 rows in quotes-source.csv.");

master.length === 2572
  ? pass("The master CSV has the expected 2,572 rows.")
  : fail(`The master CSV has ${master.length} rows; expected 2572.`);
movies.length === 572
  ? pass("The master CSV contains the expected 572 movie records.")
  : fail(`The master CSV contains ${movies.length} movies; expected 572.`);
expectUnique("Movie IDs", movies.map((movie) => movie.id));

const incompleteMovies = movies.filter(
  (movie) => !clean(movie.id) || !clean(movie.title)
);
incompleteMovies.length
  ? fail(`${incompleteMovies.length} movies lack an id or title.`)
  : pass("Every movie has an id and title.");

const ratingFields = [
  "Rating_Tech",
  "Rating_Recommend",
  "Rating_Personal2",
  "Rating_Final"
];
const invalidRatings = movies.flatMap((movie) =>
  ratingFields
    .filter((field) => {
      const value = clean(movie[field]);
      return value && (!Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 10);
    })
    .map((field) => `${movie.id} ${field}=${movie[field]}`)
);
invalidRatings.length
  ? fail(`Invalid movie ratings: ${invalidRatings.slice(0, 10).join(", ")}`)
  : pass("All populated movie ratings are numeric values from 0 through 10.");

expectCount("art-references.json", references, 123);
const allowedCategories = new Set([
  "gesture",
  "anatomy",
  "portrait",
  "landscape",
  "animals",
  "architecture",
  "still-life"
]);
const invalidCategories = references.filter(
  (item) => !allowedCategories.has(clean(item.category))
);
invalidCategories.length
  ? fail(`${invalidCategories.length} art references use invalid categories.`)
  : pass("All art references use categories supported by the interface.");
expectUnique("Art reference image paths", references.map((item) => item.src));
references.forEach((item, index) =>
  expectLocalFile(`Art reference row ${index + 1}`, item.src)
);

const usedCategories = new Set(references.map((item) => clean(item.category)));
const emptyCategories = [...allowedCategories].filter(
  (category) => !usedCategories.has(category)
);
if (emptyCategories.length) {
  warn(`Visible art categories currently empty: ${emptyCategories.join(", ")}.`);
}

expectCount("images.json", quoteImages, 51);
expectUnique("Quote image paths", quoteImages);
quoteImages.forEach((path, index) =>
  expectLocalFile(`Quote image row ${index + 1}`, path)
);

const missingHtmlReferences = [];
["index.html", "quotes.html", "art.html", "movies.html"].forEach((htmlFile) => {
  for (const match of text(htmlFile).matchAll(/\b(?:href|src)=["']([^"']*)["']/gi)) {
    const reference = clean(match[1]).split(/[?#]/)[0];
    if (
      reference &&
      reference !== "/" &&
      !reference.startsWith("#") &&
      !/^[a-z][a-z\d+.-]*:/i.test(reference) &&
      !existsSync(file(reference))
    ) {
      missingHtmlReferences.push(`${htmlFile} -> ${reference}`);
    }
  }
});
missingHtmlReferences.length
  ? fail(`Missing HTML references: ${missingHtmlReferences.join(", ")}`)
  : pass("All local files referenced directly by the HTML pages exist.");

const syntaxErrors = [
  "quoteapp.js",
  "art-reference.js",
  "movies.js",
  "sw.js",
  "scripts/validate-project.mjs"
].filter(
  (path) =>
    spawnSync(process.execPath, ["--check", file(path)]).status !== 0
);
syntaxErrors.length
  ? fail(`JavaScript syntax errors: ${syntaxErrors.join(", ")}`)
  : pass("All JavaScript files pass Node syntax checks.");

const legacyImages = readdirSync(file("images"), { withFileTypes: true }).filter(
  (entry) =>
    entry.isFile() &&
    [".jpg", ".jpeg", ".png", ".webp"].includes(extname(entry.name).toLowerCase())
);
if (legacyImages.length) {
  warn(
    `${legacyImages.length} legacy quote images remain in images/; the app uses images/quotes/.`
  );
}

const backups = [
  "data-bad-import-backup.json",
  "data-broken-backup.json"
].filter((path) => existsSync(file(path)));
if (backups.length) {
  warn(`Historical backup data remains in the root: ${backups.join(", ")}.`);
}
if (!Array.isArray(manifest.icons) || !manifest.icons.length) {
  warn("manifest.json has no install icons.");
}
if (text("index.html").includes("<!--script>")) {
  warn("Service-worker registration is intentionally commented out.");
}
if (text("sw.js").includes("registration.unregister()")) {
  warn("sw.js is still the temporary cache-clearing uninstall worker.");
}

console.log("\nPWA Studio validation\n");
passes.forEach((message) => console.log(`PASS  ${message}`));
warnings.forEach((message) => console.log(`WARN  ${message}`));
failures.forEach((message) => console.error(`FAIL  ${message}`));
console.log(
  `\n${passes.length} passed, ${warnings.length} warning(s), ${failures.length} failure(s).\n`
);

if (failures.length) process.exitCode = 1;
