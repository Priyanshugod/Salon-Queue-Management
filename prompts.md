# Prompts Used — Salon Queue Management System

This file records the AI coding and project-development prompts provided for the Salon Queue Management System, in the order supplied.

> Note: This is a record of the prompts shared for this submission. Add any other prompts used during development, including unsuccessful attempts, to preserve the complete history.

---

## Prompt 1 — Generate the project documentation suite

I am building a Real-Time Salon Queue Management System web application (React + Vite + Tailwind CSS). 
I have attached a reference template photo showing the exact visual style, design language, and layout aesthetic I want to use (notice the colors, typography, border styling, buttons, and overall feel). 

I need you to generate the complete, production-grade documentation suite inside a `/docs` folder consisting of 4 comprehensive markdown files:
1. `docs/01-brief.md`
2. `docs/02-screens.md`
3. `docs/03-flows-rules.md`
4. `docs/04-build-plan.md`

Follow the structural and functional requirements below:

### Core System Requirements (Must be present across all docs)

1. **User Personas & 7 Required Screens**:
   - Customer Mobile: Home (`/`), Join Queue (`/join`), Live My Status Tracker (`/status/:id`)
   - Staff / Operations: Receptionist Tablet Dashboard (`/reception`), Barber Workstation View (`/barber/:name`), Waiting Area Wall TV Display (`/display`), Owner Settings & Analytics (`/admin`)

2. **Core Feature Set**:
   - Remote online join with service selection (max 3), barber preference ("Specific Barber" or "Any Barber (fastest)"), and duplicate active phone number guard.
   - Live queue status tracker with dynamic position, countdown wait estimate, and full-screen "It's your turn!" approach alerts.
   - Walk-in customer registration at reception (appended strictly to the end of the queue with new token).
   - Smart FIFO queue dispatch: Calling "Next" for Barber X skips customers who requested a different barber and picks the next customer wanting Barber X or "Any barber".
   - Workstation timer controls (`Start Service` -> `Done`), preventing single-chair concurrency.
   - Full-screen TV display with active barber column flashes and Web Audio chime on call.
   - Centralized bilingual localization dictionary (English & Gujarati) with persistent header toggle.
   - Owner settings: Master queue toggle, 30-min auto-cutoff rule, services management, and barber roster controls.
   - Cross-device real-time sync (< 5s latency) across customer phones, reception tablets, barber workstations, and TV displays.

### File-by-File Specifications to Generate

#### 1. `docs/01-brief.md`
- **Problem Statement**: Weekend salon congestion, uncertainty, disputes, and lost revenue.
- **Target Users & Personas**: Remote Customer, Walk-in Customer, Receptionist, Barbers, Owner.
- **Project Objectives**: Elimination of physical waiting chaos through live status and synchronous salon dispatch.
- **Scope & Out-of-Scope Boundaries**: Explicitly list what is included, and define strictly out-of-scope items (no online payments, no future calendar appointments, no SMS/WhatsApp API dependencies, no loyalty programs).
- **Core Feature List**: Detailed breakdown of check-in, tracking, reception dispatch, barber actions, TV display, admin controls, and bilingual support.

#### 2. `docs/02-screens.md`
- **Visual Design System (Extracted directly from the attached template photo)**:
  - Exact Color Palette (Primary, Secondary, Background Canvas, Surface Cards, Borders, Status Accents for Available, Busy, On Break).
  - Typography system (Heading font, Body font, Weights, Sizing scale).
  - Component styling (Corner radius `rounded-*`, border thickness, shadow depth, button styles, active states).
- **Detailed UI/UX Specifications for all 7 screens**:
  - Exact layout structure (Mobile-first vs Tablet 2-column vs TV landscape non-scrolling grid).
  - Header strips, action bars, modals, confirmation dialogues, and empty state treatments.
  - Component breakdown with field validation and button states (Default, Active, Disabled, Loading).
  - Dummy data sets (sample barbers with photos, 8 services with durations & INR prices, sample active tokens).

#### 3. `docs/03-flows-rules.md`
- **Step-by-Step Scenario Walkthroughs**:
  - Scenario 1: Main Remote Customer Flow (Join -> Track -> Approaching Alert -> Called -> In Chair -> Done).
  - Scenario 2: Walk-In Customer Flow at Reception.
  - Scenario 3: Barber Workstation Lifecycle (`Waiting` -> `Called` -> `In chair` -> `Done`).
  - Scenario 4: No-Show Handling (10-minute grace period guard, ejection, and re-add at bottom with fresh token).
  - Scenario 5: Customer Cancellation with modal confirmation.
- **Queue State Machine**: Allowed state transitions map and strict guard rules against illegal or backwards jumps.
- **Wait Time Formula**: Mathematical formula: `(Total Service Minutes of Customers Ahead) / (Active On-Duty Working Barbers)`.
- **Zero-Barber Guard**: Clear fallback behavior when all barbers are on break.
- **15-Point Verification Test Checklist**: Exact numbered end-to-end test cases verifying all business rules and real-time syncing.

#### 4. `docs/04-build-plan.md`
- **Incremental, Step-by-Step Implementation Guide**:
  - Step 1: Project setup, theme configuration from the template photo, routing, and bilingual localization setup.
  - Step 2: Shared Queue store, state machine, wait time algorithms, and mock seed data.
  - Step 3: Screens 1, 2, 3 (Home, Join Queue, My Status Tracker).
  - Step 4: Screen 4 (Reception Dashboard & Walk-In Modal).
  - Step 5: Screens 5 & 6 (Barber Workstation & Waiting Area TV Display with audio chime).
  - Step 6: Screen 7 (Owner Admin Settings) & cross-viewport real-time synchronization.
  - Step 7: Edge cases, lifecycle guards, Gujarati translation audit, and 15-point test verification.
  - Step 8: Production build, Vercel deployment configuration, and README documentation.
- For every step, provide:
  - Clear **Goal**
  - Concrete **Files to Create / Modify**
  - Exact **Copy-Paste Prompt** for the coding agent
  - Clear **Verification & Testing Criteria**

---

## Prompt 2 — Implement the documentation and build the website incrementally

i have attached the theme of the website 

as a screenshot
now implement the document and start making website one by one make sure start from step 1  and finish it 

---

## Prompt 3 — Ask about the database

are we using sql lite?

---

## Prompt 4 — Ask about expected user capacity

how many user can be  here so that we can create

---

## Prompt 5 — Review the project and deployment readiness

check the project properly so that i can deploy it in vercel 
https://salon-queue-management-k2e2.vercel.app/

---

## Prompt 6 — Update the README with the live deployment link

add this link on top of my readme
https://salon-queue-management-k2e2.vercel.app/
