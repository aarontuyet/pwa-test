# PWA Studio Design Guide

## Design Intent

PWA Studio should feel like a collection of thoughtful personal instruments rather than a conventional software dashboard.

The design should remain:

- Visually calm
- Easy to understand
- Comfortable on phones
- Distinctive without becoming distracting
- Consistent enough to feel like one studio
- Flexible enough for each tool to retain its own identity

## Shared Visual System

The homepage, Quotes, Movies, and Art References belong to the same family.

When changing one application, preserve consistency in:

- Typography
- Color relationships
- Spacing
- Buttons and controls
- Cards and content containers
- Navigation
- Hover and focus behavior
- Mobile layout
- Overall visual atmosphere

Do not make one tool feel more polished by making it visually unrelated to the others.

## Application Character

### Homepage

The homepage is the entrance to the studio. It should quickly communicate what tools are available without feeling crowded.

### Quotes

Quotes should prioritize the words themselves. The interface should remain quiet, readable, and reflective.

### Movies

Movies contains the greatest amount of information and interaction. Search, filtering, sorting, and recommendations should remain clear without turning the page into a dense database interface.

### Art References

Art References should keep the images central. Categories and controls should support exploration without competing with the artwork.

## Responsive Design

Phone-sized layouts are a primary experience, not a reduced desktop version.

Changes should be checked for:

- Readable text without zooming
- Controls that are easy to tap
- No unintended horizontal scrolling
- Images that resize without distortion
- Comfortable spacing on narrow screens
- Navigation that remains understandable
- Filters that do not overwhelm the page

## Accessibility

Design changes should preserve or improve:

- Sufficient color contrast
- Visible keyboard focus
- Semantic headings
- Descriptive image alternative text
- Labels for interactive controls
- Usable tap targets
- Respect for reduced-motion preferences when animation is used

## Preservation Rule

Do not redesign the project during stabilization.

Before changing established colors, type, spacing, layout, animation, or interaction patterns:

1. Identify the specific problem.
2. Confirm that the change solves that problem.
3. Check the effect across all applications.
4. Compare desktop and phone-sized layouts.
5. Document any intentional visual-system change.

## Future Design Documentation

During stabilization, record the project’s actual:

- Color palette
- Font families and sizes
- Spacing patterns
- Breakpoints
- Reusable components
- Icon and image conventions

These should be documented from the existing code rather than invented from memory.