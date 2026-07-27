# PWA Studio Project Overview

## Purpose

PWA Studio is a personal collection of small, focused web tools built around art, memory, discovery, reflection, and entertainment.

The studio currently brings three tools together within one shared homepage and visual system:

- Quotes
- Movies
- Art References

The project should remain understandable, portable, inexpensive to host, and easy to maintain.

## Current Architecture

PWA Studio currently uses:

- Vanilla HTML
- CSS
- JavaScript
- JSON and CSV data
- Local image assets
- Static web hosting

Despite its name, the project does not currently have active installation or offline functionality. Restoring genuine PWA behavior is part of the stabilization backlog.

## Current Priority

The immediate priority is stabilization rather than expansion.

This includes:

- Documenting the existing structure
- Establishing reliable sources of truth for data
- Validating data and image references
- Adding lightweight testing
- Restoring intentional PWA functionality
- Preserving the current appearance and behavior
- Preparing the repository for safe development with Codex

## Product Principles

- Build small tools that are personally meaningful and genuinely useful.
- Preserve simplicity unless added complexity provides a clear benefit.
- Favor clarity, atmosphere, and ease of use over excessive features.
- Treat the tools as parts of one studio without forcing them to become identical.
- Keep human judgment at the center of curation, design, and direction.
- Use automation to reduce repetitive work, not to flatten creative decisions.

## Current Applications

### Quotes

A collection of approximately 2,000 quotations intended for reflection and discovery.

### Movies

A searchable and filterable movie collection containing approximately 572 active records, supported by a larger master CSV.

### Art References

A categorized visual-reference collection containing approximately 123 entries and their associated images.

## Stabilization Is Complete When

- The purpose and structure of the project are documented.
- The authoritative source for each dataset is identified.
- All expected data files and images can be validated.
- IDs, required fields, categories, and file paths can be checked automatically.
- The homepage and all three tools pass basic browser tests.
- Desktop and phone-sized layouts have been verified.
- PWA installation and offline behavior work intentionally.
- A repeatable update and release process is documented.
- Future Codex sessions can understand the project without reconstructing its history.

## Current Non-Goals

Unless explicitly reconsidered, stabilization does not include:

- Migrating the project to React or another framework
- Redesigning the existing interface
- Replacing the current hosting platform
- Adding user accounts or cloud synchronization
- Adding major new applications
- Introducing a complex build system