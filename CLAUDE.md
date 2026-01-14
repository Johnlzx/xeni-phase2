# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Xeni is a UK Immigration (UKVI) case management prototype for immigration lawyers and OISC advisors. The application helps legal professionals manage visa applications, document collection, evidence verification, and compliance tracking. The design philosophy follows a "UKVI Command Center" concept where lawyers build evidence chains rather than simply managing files.

## Development Commands

```bash
npm run dev     # Start Next.js development server
npm run build   # Production build
npm run lint    # Run ESLint
npm start       # Start production server
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand with devtools
- **UI Components**: Radix UI primitives + shadcn/ui pattern
- **Styling**: Tailwind CSS with CSS variables for theming
- **Animations**: Motion (Framer Motion)
- **Drag & Drop**: react-dnd with HTML5 backend
- **Forms**: react-hook-form

## Architecture

### Directory Structure

```
app/                    # Next.js App Router pages
├── cases/
│   └── [caseId]/      # Dynamic case detail page
components/
├── case-detail/        # Main case management UI
│   ├── overview/       # Overview page (file upload, profile)
│   ├── application/    # Application workflow (visa selection, checklist)
│   ├── file-hub/       # Document organization
│   ├── checklist/      # Dynamic checklist modes
│   └── shared/         # Shared components (modals, etc.)
├── case-hub/           # Case list and creation
├── command-center/     # Evidence verification workbench
├── review-dialog/      # PDF review with drag-drop page management
└── ui/                 # Base UI components (shadcn/ui style)
store/                  # Zustand stores
├── case-detail-store.ts   # Main case state (documents, profile, checklist)
└── command-center-store.ts
types/                  # TypeScript definitions
├── index.ts            # Core types (Case, Visa, Issue, etc.)
└── case-detail.ts      # Case detail specific types
data/                   # Mock data
├── cases.ts            # Sample cases
├── visa-routes.ts      # UK visa route configurations
└── evidence-modules.ts # Evidence requirements per visa type
```

### Key Patterns

**State Management**: The `case-detail-store.ts` is the central state store managing:
- Navigation state (overview/documents/application)
- Document groups with file management (upload, move, reorder, delete)
- Checklist evolution (empty → questionnaire → partial → detailed)
- Application workflow phases (idle → visa_selected → analyzing → completed)
- Client profile extraction from documents

**Component Organization**: Each major feature has its own directory with:
- Main page component (e.g., `OverviewPage.tsx`)
- Sub-components
- `index.ts` barrel export

**UI Pattern**: Components use the `cn()` utility from `lib/utils.ts` for conditional Tailwind classes. Radix primitives are wrapped in `components/ui/` with consistent styling.

### Domain Concepts

- **Case**: An immigration case with applicant, advisor, documents, and status
- **Visa Type**: skilled-worker, global-talent, student, family, visitor, innovator
- **Document Groups**: Categorized document collections (Passport, Bank Statement, etc.)
- **Checklist Stage**: Progressive disclosure from initial questions to detailed requirements
- **Application Phase**: State machine for the visa application workflow

### Styling

- CSS variables defined in `app/globals.css` for theming
- Custom color tokens: `brand`, `sidebar-*` variants
- Font families: Inter (body), Poppins (headings)
