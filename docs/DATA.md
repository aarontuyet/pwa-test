# PWA Studio Data Guide

## Purpose

PWA Studio relies on curated data for Quotes, Movies, and Art References.

Data changes should be deliberate, repeatable, and validated. No dataset should be overwritten until its purpose and relationship to the application are understood.

## Core Rules

- Identify the authoritative source before editing data.
- Preserve original source files whenever practical.
- Do not edit generated files manually when they can be rebuilt from a source file.
- Do not delete backup or import files until their purpose has been confirmed.
- Preserve existing IDs unless an intentional migration is documented.
- Check every image path after moving, renaming, adding, or removing assets.
- Validate JSON syntax before deployment.
- Record any transformation from source data to application data.

## Current Data Inventory

### Quotes

Authoritative source:

- `quotes-source.csv`

Application data:

- `data.json`

Confirmed relationship:

- Both files contain 2,000 quotes in the same order.
- `data.json` is the normalized application version of `quotes-source.csv`.
- IDs in `data.json` are sequential from 1 through 2,000.
- `Quote` maps to `content`.
- `Column 7` maps to `creator`.
- `Year` maps to `year`.
- `Topic` maps to `category`.
- `Sub-topic` maps to `subcategory`.
- `From` maps to `source`.
- The application requires `id`, `type`, `content`, and `creator`.

Quote images are listed in `images.json` and stored in `images/quotes/`. The list currently contains 51 unique, valid paths.

Historical files `data-bad-import-backup.json` and `data-broken-backup.json` are not used by the application. Preserve them until an archival cleanup is approved.

### Movies

Authoritative and application source:

- `TAOPROJECT_Master_Table - PWA.csv`

Confirmed relationship:

- The master CSV contains 2,572 rows.
- `movies.js` loads this CSV directly in the browser.
- A row appears in Movies when its `type` value is `Movie`, matched without regard to capitalization.
- The current master contains 572 movie rows.
- Every current movie has a unique `id` and a non-empty `title`.
- Search uses title, content, creator/director, year, era, category, subcategory, tags, watch status, awards, ratings, importance, favorite, context, meaning, notes, and source.
- Filters use era, normalized watch status, and `Rating_Final`.
- Sorting uses `Rating_Final`, `WantRank`, year, title, or creator/director.
- Recommendations use ratings, importance, favorite, `WantRank`, and awards.
- Missing numeric values are treated as absent rather than zero during sorting.
- The application does not currently use movie poster images.

### Art References

Authoritative application index:

- `art-references.json`

Image assets:

- `images/art-reference/`

Confirmed relationship:

- `art-references.json` contains 123 entries.
- Each entry contains `category` and `src`.
- Every current `src` path exists and is unique.
- Supported categories are `gesture`, `anatomy`, `portrait`, `landscape`, `animals`, `architecture`, and `still-life`.
- `architecture` is currently visible in the interface but has no reference entries.
- `images.json` does not belong to Art References; it is the quote-image list.

## Required Validation

Future validation should check:

- JSON files parse successfully.
- Required files exist.
- Required fields are present.
- IDs are unique.
- Referenced images exist.
- Image filenames match their data references.
- Categories use approved values.
- Record counts remain within expected ranges.
- URLs, dates, ratings, and other structured values use consistent formats.
- Duplicate records are identified.
- Generated application data matches its source.

## Intended Data Workflow

The stabilized project should eventually use a repeatable process:

1. Update the authoritative source file.
2. Run one documented generation command.
3. Validate the generated data.
4. Review record counts and warnings.
5. Test the affected application.
6. Commit the source and generated changes together.
7. Record meaningful structural changes in `DECISIONS.md`.

## Data Safety

Do not silently repair or discard questionable records.

When validation finds an issue:

- Report the exact file and record.
- Explain why it may be invalid.
- Preserve the original value.
- Separate clear errors from records requiring human judgment.
- Ask before making broad corrections.

Human curation remains the source of meaning. Automation should protect the collection, not redefine it.

## Stabilization Task

Run the project validator after data or image changes:

```text
node scripts/validate-project.mjs
```

The current validator enforces the confirmed record counts, required fields, unique IDs, source consistency, category values, rating formats, and referenced image paths.

The next data task is to create a documented generator for `data.json` from `quotes-source.csv`, so quote updates do not require manual synchronization.
