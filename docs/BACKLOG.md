# PWA Studio Backlog

## Purpose

This backlog records planned work for PWA Studio and keeps stabilization separate from future expansion.

Tasks should be reviewed before implementation. Completion requires verification, not merely a code change.

## Priority Levels

- **Now:** Required for stabilization
- **Next:** Valuable after the project is stable
- **Later:** Future development and experimentation
- **Investigate:** Requires more information before deciding

## Now: Stabilization

### Project Structure

- Confirm that the local working folder contains the newest version of every application.
- Reconcile the local project with the GitHub repository and latest ZIP archive.
- Document the actual folder and file structure.
- Separate production files, source data, scripts, and archival backups where useful.
- Keep historical files until their purpose is understood.
- Create a clear `README.md` for setup, navigation, testing, and deployment.

### Data

- [x] Identify the authoritative source for Quotes.
- [x] Identify the authoritative source for Movies.
- [x] Identify the authoritative source for Art References.
- [x] Document current source-to-application relationships.
- [x] Confirm required fields, ID rules, categories, and expected record counts.
- [x] Add validation for JSON syntax, duplicate IDs, missing fields, invalid categories, and missing images.
- Create one repeatable process for generating application data from its source.
- Review unused, empty, or underrepresented Art Reference categories.

### Testing

- Establish and document a reliable local testing method.
- Record a manual baseline test for the homepage and all three applications.
- [x] Add lightweight automated checks for JavaScript and JSON syntax.
- [x] Add data and image-path validation.
- Add basic browser tests for page loading, navigation, search, filters, and categories.
- Verify desktop, narrow-phone, and phone-landscape layouts.
- Check the browser console for current errors and warnings.

### PWA Functionality

- Review the existing manifest and service worker.
- Decide which pages, data, and assets should be available offline.
- Add appropriate application icons and manifest metadata.
- Restore service-worker registration with an intentional cache strategy.
- Add safe cache versioning and cleanup.
- Test installation, offline use, and application updates.
- Confirm that users cannot become trapped on stale application files.

### Design Documentation

- Extract the actual color palette from the existing CSS.
- Document typography, spacing, breakpoints, and shared interface patterns.
- Identify repeated components that should remain visually consistent.
- Record any intentional differences among Quotes, Movies, and Art References.
- Review basic accessibility, including contrast, focus states, labels, alternative text, and tap targets.

### Release Process

- Document how the project is packaged and uploaded.
- Create a pre-release checklist.
- Create a post-deployment smoke test.
- Confirm that every deployment includes required data and image assets.
- Preserve a recoverable copy of the last working release.
- Establish GitHub as the project’s long-term source of truth.

## Next: Application Improvements

### Movies

- Review the complete search, filter, sort, and recommendation experience.
- Improve empty states and missing-data handling.
- Review which master CSV records become active movie records.
- Consider saved filters, favorites, watch status, or personal notes.
- Improve discovery without turning the tool into a dense database interface.

### Quotes

- Add discovery methods beyond pure randomness.
- Consider themes, authors, favorites, history, or reflective prompts.
- Review duplicate and incomplete records.
- Preserve the quiet, text-centered experience.

### Art References

- Develop references into guided practice or study sessions.
- Improve category balance and empty-category handling.
- Consider favorites, prompts, comparisons, or timed studies.
- Preserve image quality and human curation.

## Later: Studio Expansion

- Add another small application only after stabilization is complete.
- Identify repeated patterns that could become shared components.
- Consider local persistence when a real use case requires it.
- Consider cloud synchronization only if it provides clear value.
- Reconsider a framework only when project complexity creates genuine pressure for one.
- Explore turning reports, spreadsheets, taxonomies, and creative frameworks into additional focused tools.

## Investigate

- Determine whether the current hosting platform provides all required PWA headers and behavior.
- Determine whether external movie images or metadata need a more reliable strategy.
- Review browser-storage requirements across the applications.
- Evaluate whether a simple validation script requires Node.js or can remain dependency-free.
- Determine which automated browser-testing approach fits the project without adding unnecessary complexity.

## Task Completion Standard

A task is complete when:

- The intended change is implemented.
- Relevant manual or automated tests pass.
- Desktop and phone behavior have been checked when applicable.
- Data and assets remain intact.
- Documentation reflects any structural decision.
- Known limitations or follow-up work are recorded.
