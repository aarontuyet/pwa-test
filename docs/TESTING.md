# PWA Studio Testing Guide

## Purpose

Every change should be verified before deployment.

Testing should remain lightweight and practical while protecting the homepage, Quotes, Movies, Art References, data, images, and mobile experience.

## Current Testing Approach

Until automated tests are added, use the manual checks in this document.

Record any known failure rather than assuming it is unrelated to the current change.

## Local Testing

Open the project through the local method normally used during development.

Do not rely only on opening an HTML file directly if the feature being tested requires:

- Data loading
- Service workers
- Offline behavior
- Browser storage
- URL routing

The preferred local testing method will be documented during stabilization.

## Core Smoke Test

After any substantial change, confirm:

### Homepage

- The page loads without visible errors.
- Quotes, Movies, and Art References are shown.
- Each application link opens the correct page.
- Images, icons, colors, and typography appear correctly.
- Navigation remains usable on desktop and phone-sized screens.

### Quotes

- Quote data loads.
- A quote is displayed correctly.
- Controls respond as expected.
- Text remains readable on narrow screens.
- Long quotations do not break the layout.

### Movies

- Movie data loads.
- Search returns relevant results.
- Filters work independently and together.
- Sorting works as expected.
- Recommendations display correctly.
- Missing information does not break a card or result.
- Clearing filters restores the expected collection.

### Art References

- Reference data loads.
- Images display correctly.
- Category controls work.
- Image proportions are preserved.
- Missing or empty categories are handled clearly.
- The page remains usable with narrow phone dimensions.

## Browser Console

During testing, open the browser developer tools and check the Console.

Investigate:

- JavaScript errors
- Failed data requests
- Missing images
- Invalid file paths
- Service-worker errors
- Unexpected warnings introduced by the change

## Responsive Testing

At minimum, check:

- A standard desktop width
- A narrow phone width
- A phone in landscape orientation

Confirm:

- No unintended horizontal scrolling
- Text remains readable
- Buttons and controls are easy to tap
- Filters remain understandable
- Images do not stretch or overflow
- Content is not hidden behind navigation
- Spacing remains comfortable

## Data Validation

Run:

```text
node scripts/validate-project.mjs
```

The command currently confirms:

- JSON parses successfully.
- Required data files exist.
- JavaScript syntax is valid.
- Expected record counts are unchanged.
- IDs are unique.
- Required quote and movie fields are present.
- `data.json` matches `quotes-source.csv`.
- Movie ratings use valid numeric values.
- Referenced images exist.
- Categories and structured values are valid.
- No unintended duplicate records were introduced.

Warnings record known cleanup and PWA work without making otherwise healthy data fail validation.

## PWA Testing

After deploying a PWA change:

1. Open the production site while online.
2. Confirm the browser offers **Install PWA Studio** and the app icon appears correctly.
3. Open the homepage, Quotes, Movies, and at least one Art Reference.
4. In browser developer tools, confirm `sw.js` is active and controlling the page.
5. Switch the browser Network panel to **Offline**.
6. Reload the homepage and each application.
7. Confirm Quotes still produces quote-and-image pairs.
8. Confirm Movies loads, searches, and filters.
9. Confirm the Art Reference viewed while online remains available.
10. Return online, deploy or edit a harmless visible test change, and confirm the new version replaces the old one after reload.

The service worker intentionally uses the network first and cached files as an offline fallback. It precaches the application shell, all data, and Quote images. Art Reference images are cached as they are viewed so the first visit does not require downloading the roughly 40 MB collection.

## Change-Specific Testing

In addition to the smoke test, test the exact behavior affected by the change.

For every completed task, report:

- What changed
- What was tested
- What passed
- What was not tested
- Any unresolved risk or follow-up

## Future Automated Testing

Stabilization should add lightweight automated checks for:

- HTML page availability
- JavaScript and JSON syntax
- Required data fields
- Unique IDs
- Image-path validity
- Basic browser loading
- Search and filter behavior
- Phone-sized layout failures

Automated tests should support human review, not create unnecessary project complexity.
