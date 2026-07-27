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
├── AGENTS.md
├── README.md
├── docs/
│   ├── PROJECT.md
│   ├── DESIGN.md
│   ├── DATA.md
│   ├── TESTING.md
│   ├── DECISIONS.md
│   └── BACKLOG.md
├── quotes/
├── movies/
├── art-references/
└── shared project assets