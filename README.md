# PWA Studio

PWA Studio is a personal collection of small web tools built around art, memory, discovery, reflection, and entertainment.

The project currently includes:

- Quotes
- Movies
- Art References

Repository: https://github.com/aarontuyet/pwa-test

## Current Status

The applications are functional, but the project is undergoing stabilization before further expansion.

Current priorities include:

- Documenting the existing structure
- Identifying authoritative data sources
- Adding data and asset validation
- Establishing lightweight testing
- Restoring intentional installation and offline behavior
- Creating a reliable release process
- Preparing the project for safe development with Codex

## Technology

PWA Studio currently uses:

- HTML
- CSS
- Vanilla JavaScript
- JSON and CSV data
- Local image assets
- Static web hosting

The project intentionally does not use a JavaScript framework or complex build system.

## Applications

### Quotes

A curated collection of approximately 2,000 quotations for reflection and discovery.

### Movies

A searchable and filterable movie collection containing approximately 572 active records, supported by a larger master CSV.

### Art References

A categorized collection of approximately 123 visual references and their associated images.

## Project Structure

```text
pwa-test/
├── index.html
├── quotes.html
├── art.html
├── movies.html
├── style.css
├── quoteapp.js
├── art-reference.js
├── movies.js
├── data.json
├── quotes-source.csv
├── TAOPROJECT_Master_Table - PWA.csv
├── art-references.json
├── images.json
├── images/
├── manifest.json
├── sw.js
├── AGENTS.md
├── README.md
├── docs/
│   ├── PROJECT.md
│   ├── DESIGN.md
│   ├── DATA.md
│   ├── TESTING.md
│   ├── DECISIONS.md
│   └── BACKLOG.md
└── scripts/
    └── validate-project.mjs
```

The applications currently live as root-level HTML, CSS, and JavaScript files. Curated source data, generated application data, and historical backup files also remain in the root while the structure is stabilized.

## Development Principles

- Preserve the project’s current visual identity.
- Prefer small, understandable changes.
- Keep the applications simple and portable.
- Validate changes instead of assuming they work.
- Protect curated data and image assets.
- Treat phone-sized layouts as a primary experience.
- Document important structural or architectural decisions.
- Keep human judgment central to design and curation.

## Documentation

Before making substantial changes, read:

- `AGENTS.md` for development instructions
- `docs/PROJECT.md` for purpose and scope
- `docs/DESIGN.md` for visual guidance
- `docs/DATA.md` for confirmed data sources and handling rules
- `docs/TESTING.md` for verification expectations
- `docs/DECISIONS.md` for settled project decisions
- `docs/BACKLOG.md` for planned work

## Validation

The project includes a dependency-free Node validation script:

```text
node scripts/validate-project.mjs
```

It checks:

- Required application files
- JSON and JavaScript syntax
- Expected record counts
- Required quote and movie fields
- Unique quote and movie IDs
- Quote source-to-application consistency
- Movie rating formats
- Art-reference categories and image paths
- Quote image paths
- Local files referenced by the HTML pages

Warnings identify known cleanup work without failing validation.

## Local Development

The application must be opened through a local web server because its data is loaded with `fetch()`. Opening the HTML files directly may prevent Quotes, Movies, and Art References from loading their data.

From the project root, one dependency-free option is:

```text
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Testing

Before deployment:

1. Run `node scripts/validate-project.mjs`.
2. Follow the smoke test in `docs/TESTING.md`.
3. Check the homepage, Quotes, Movies, and Art References.
4. Check desktop and narrow phone layouts.
5. Check the browser console for errors and missing files.

## Deployment

The current process uses manual file upload to GitHub `main`, followed by Cloudflare Pages deployment.

The `cloudflare/workers-autoconfig` branch is a stale Cloudflare setup branch and is not the application source. Do not merge it into `main`.

The production Pages URL is:

```text
https://pwa-test-c8n.pages.dev/
```

## Current Limitations

- The PWA caches the complete app shell, all application data, and all Quote images for offline use.
- Art Reference images are cached as they are viewed rather than downloaded as a 40 MB collection on first visit.
- Historical backup data and a duplicate set of quote images remain in the production root pending deliberate cleanup.
- Automated browser tests have not yet been added.

## Future Direction

PWA Studio should grow as a collection of focused, personally meaningful instruments.

Major new features, applications, framework migrations, and cloud services should wait until the existing project has been stabilized and a clear need has emerged.
