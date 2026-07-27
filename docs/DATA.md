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

Known files include:

- `quotes/data.json`
- `quotes/quotes-source.csv`
- Additional import or backup files

The relationship between these files must be confirmed during stabilization.

Questions to resolve:

- Which file is the authoritative quote collection?
- Is `data.json` generated from the CSV?
- Which backup files remain necessary?
- How are quote IDs assigned and preserved?
- Which fields are required by the application?

### Movies

Known files include:

- A master CSV containing approximately 2,572 rows
- Application data containing approximately 572 active movie records

Questions to resolve:

- Which file is the authoritative movie source?
- What determines whether a master record appears in the application?
- How is the application data generated?
- Which fields power search, filtering, sorting, and recommendations?
- How are missing values handled?
- Are poster or image references stored locally or externally?

### Art References

Known files include:

- `art-references/art-references.json`
- `art-references/images.json`
- Local image assets

The current collection contains approximately 123 references.

Questions to resolve:

- Which JSON file is authoritative?
- What role does each JSON file play?
- How are image filenames linked to reference records?
- Which categories are allowed?
- Should empty or underused categories remain visible?
- How are new images prepared and named?

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

During stabilization, inspect the application code and existing files to replace the unresolved questions in this document with confirmed answers.

Once the sources of truth are known, document:

- Authoritative source files
- Generated files
- Required fields
- Allowed categories
- ID rules
- Image naming rules
- Update commands
- Expected record counts