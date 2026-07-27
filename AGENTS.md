# PWA Studio Working Instructions

## Project Purpose

PWA Studio is a personal collection of small, focused web tools. It currently includes Quotes, Movies, and Art References within a shared visual system.

## Current Priority

Stabilize and document the existing project before expanding it.

Preserve the current appearance and behavior unless a confirmed defect requires a change.

## Development Rules

- Inspect the relevant HTML, CSS, JavaScript, data, and asset files before editing.
- Prefer the smallest change that fully solves the problem.
- Keep the project in vanilla HTML, CSS, and JavaScript unless a framework migration is explicitly approved.
- Do not introduce a build system or unnecessary dependency without explaining the benefit.
- Do not delete, rename, or relocate images, data files, or application folders without checking every reference.
- Preserve mobile usability and the shared visual identity across all tools.
- Treat data integrity, image paths, accessibility, and browser behavior as part of every change.
- Never assume that a change works. Validate it.

## Required Reading

Before substantial development, read the relevant files in `docs/`:

- `PROJECT.md`
- `DESIGN.md`
- `DATA.md`
- `TESTING.md`
- `DECISIONS.md`
- `BACKLOG.md`

## Verification

When making application changes:

- Test the homepage.
- Test Quotes.
- Test Movies.
- Test Art References.
- Check both desktop and phone-sized layouts.
- Report what changed, what was tested, and any unresolved risks.