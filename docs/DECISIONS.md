# PWA Studio Decision Log

## Purpose

This file records decisions that shape the project’s architecture, design, data, testing, and development direction.

A decision may be reconsidered, but it should not be silently reversed.

## Decision Format

For future entries, use:

### YYYY-MM-DD: Decision Title

**Status:** Proposed, Accepted, Superseded, or Rejected

**Decision:**  
What was decided.

**Reason:**  
Why the decision was made.

**Consequences:**  
What this decision enables, limits, or requires.

---

## Current Decisions

### 2026-07-27: Stabilize Before Expanding

**Status:** Accepted

**Decision:**  
Document, validate, and stabilize the existing project before adding another application or major feature.

**Reason:**  
The project now contains several applications, datasets, and asset collections. Reliability and clarity have become more important than quickly adding another feature.

**Consequences:**  
Current work should prioritize documentation, data validation, testing, intentional PWA behavior, and a repeatable release process.

### 2026-07-27: Retain the Current Technology

**Status:** Accepted

**Decision:**  
Keep the project in vanilla HTML, CSS, and JavaScript during stabilization.

**Reason:**  
The existing architecture remains appropriate for a small collection of static personal tools. A framework migration would add complexity without resolving the project’s immediate risks.

**Consequences:**  
Do not introduce React, another framework, or a complex build system unless a future need clearly justifies it.

### 2026-07-27: Preserve the Existing Experience

**Status:** Accepted

**Decision:**  
Preserve the current appearance and behavior unless a confirmed defect or approved improvement requires a change.

**Reason:**  
The project already has an intentional visual character. Stabilization should protect that identity rather than become an accidental redesign.

**Consequences:**  
Visual or behavioral changes should begin with a clearly identified problem and be checked across all applications and screen sizes.

### 2026-07-27: Treat the Applications as One Studio

**Status:** Accepted

**Decision:**  
Quotes, Movies, and Art References are separate tools within one shared PWA Studio.

**Reason:**  
Each tool has its own purpose, but they benefit from shared navigation, visual relationships, and development standards.

**Consequences:**  
Shared patterns should remain consistent without forcing every application to have identical layouts or interactions.

### 2026-07-27: Keep Human Curation Central

**Status:** Accepted

**Decision:**  
Automation may validate and transform data, but it should not silently redefine, discard, or broadly rewrite curated content.

**Reason:**  
The meaning of the collections comes from human selection and judgment.

**Consequences:**  
Ambiguous records, category changes, and broad corrections require review. Automated processes should report questionable data rather than making unapproved creative decisions.

### 2026-07-27: Restore PWA Behavior Intentionally

**Status:** Accepted

**Decision:**  
Installation and offline behavior should eventually be restored through a deliberate caching and update strategy.

**Reason:**  
The project is named PWA Studio, but its current service-worker behavior is disabled. Restoring it without a clear strategy could create stale or broken deployments.

**Consequences:**  
PWA work should include manifest validation, required icons, intentional caching, offline testing, cache cleanup, and a safe update process.

### 2026-07-27: Use Codex Through Reviewable Changes

**Status:** Accepted

**Decision:**  
Future Codex work should use bounded tasks, inspect the existing project before editing, validate changes, and leave a clear account of what changed.

**Reason:**  
Codex is most useful when project intent is documented and its work can be verified rather than accepted on assumption.

**Consequences:**  
Codex should follow `AGENTS.md`, read the relevant project documents, make focused changes, run available checks, and report unresolved risks.