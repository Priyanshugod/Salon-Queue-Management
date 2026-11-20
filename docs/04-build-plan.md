# Production Build & Implementation Plan

## 1. Architecture Overview & Tech Stack

```
+-----------------------------------------------------------------------------------------+
|                               REAL-TIME ARCHITECTURE                                    |
+-----------------------------------------------------------------------------------------+
|  FRAMEWORK & RUNTIME:    React 18 / 19 + Vite (Fast SPA compilation)                    |
|  STYLING & THEME:        Tailwind CSS + Headless UI / Lucide React                      |
|  TYPOGRAPHY:             Google Fonts: Playfair Display (Serif) + Plus Jakarta Sans     |
|  STATE & SYNC:           Zustand / Reactive Context + BroadcastChannel API (Sync)       |
|  LOCALIZATION:           Custom Lightweight Bilingual Dictionary (English & Gujarati)   |
|  SOUND SYNTHESIS:        Web Audio API (Zero-dependency synthesized luxury chime)       |
|  ROUTING:                React Router v6 / v7                                           |
|  DEPLOYMENT:             Vercel / Netlify SPA static export                             |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Step-by-Step Implementation Roadmap

```
+-----------------------------------------------------------------------------------------+
|                               8-STEP EXECUTION ROADMAP                                  |
+-----------------------------------------------------------------------------------------+
|  [Step 1] Project Bootstrap, Design System & Bilingual Localization Engine              |
|     │                                                                                   |
|  [Step 2] Shared Queue Store, State Machine, Algorithms & Mock Seed Data                |
|     │                                                                                   |
|  [Step 3] Screens 1, 2, 3: Customer Mobile Experience (Home, Join, Status Tracker)       |
|     │                                                                                   |
|  [Step 4] Screen 4: Receptionist Tablet Command Center & Walk-In Modal                  |
|     │                                                                                   |
|  [Step 5] Screens 5 & 6: Barber Workstation & Waiting Area TV Wall (with Audio Chime)   |
|     │                                                                                   |
|  [Step 6] Screen 7: Owner Admin Settings & Cross-Viewport Reactive Synchronization      |
|     │                                                                                   |
|  [Step 7] Edge Cases, Life Cycle Guards & 15-Point Test Verification                    |
|     │                                                                                   |
|  [Step 8] Production Build, Vercel Config & Documentation Packaging                     |
+-----------------------------------------------------------------------------------------+
```

---

### Step 1: Project Setup, Design Theme & Bilingual Localization

#### Goal
Initialize the React + Vite + Tailwind CSS project with the extracted Chérie design language, typography, color palette, navigation header, and English/Gujarati localization dictionary.

#### Files to Create / Modify
* `package.json`
* `vite.config.ts`
* `tailwind.config.js`
* `index.html` (Google Fonts: Playfair Display + Plus Jakarta Sans)
* `src/index.css`
* `src/i18n/translations.ts`
* `src/i18n/LanguageContext.tsx`
* `src/components/common/Header.tsx`
* `src/components/common/Button.tsx`
* `src/App.tsx`

#### Copy-Paste Prompt for Coding Agent
```text
Execute Step 1 of the Salon Queue System build plan:
1. Initialize a React + TypeScript + Vite project with Tailwind CSS and Lucide React icons.
2. In index.html, load Google Fonts for 'Playfair Display' (serif) and 'Plus Jakarta Sans' (sans-serif).
3. Configure tailwind.config.js to include the exact Chérie color system:
   - canvas: '#FAF7F2'
   - surface: '#FFFFFF'
   - surface-tint: '#F7EFEB'
   - terracotta: { DEFAULT: '#E07A5F', hover: '#D36B50', light: '#FDF0EC' }
   - charcoal: { DEFAULT: '#1F1F1F', muted: '#5A5550' }
   - hairline: '#E8E0D8'
   - status: { available: '#3D7C57', busy: '#E07A5F', break: '#C59B3F' }
   - fontFamily: serif: ['Playfair Display', 'serif'], sans: ['Plus Jakarta Sans', 'sans-serif']
4. Create a comprehensive bilingual dictionary in src/i18n/translations.ts supporting English ('en') and Gujarati ('gu') for all navigation, actions, states, and messages.
5. Implement LanguageContext.tsx with a persistent header toggle in src/components/common/Header.tsx.
6. Verify layout renders with warm cream canvas background and functional language switcher.
```

#### Verification & Testing Criteria
* Canvas renders with warm `#FAF7F2` background.
* Header shows `Chérie Salon` logo, navigation links, and `EN | ગુજરાતી` toggle.
* Toggling to `ગુજરાતી` immediately updates navigation text without reloading.

---

### Step 2: Shared Queue Store, State Machine & Algorithms

#### Goal
Implement the central reactive state store (`useQueueStore`) managing the queue state machine, barbers roster, service catalog, wait-time calculation formulas, and initial seed data.

#### Files to Create / Modify
* `src/types/index.ts`
* `src/data/mockData.ts`
* `src/utils/waitTime.ts`
* `src/store/useQueueStore.ts`

#### Copy-Paste Prompt for Coding Agent
```text
Execute Step 2 of the Salon Queue System build plan:
1. In src/types/index.ts, define strict TypeScript interfaces:
   - Service (id, name, nameGu, durationMinutes, priceINR, category, active)
   - Barber (id, name, station, specialty, photo, status: 'AVAILABLE' | 'BUSY' | 'ON_BREAK', currentChairToken, completedToday)
   - QueueToken (id, token, customerName, phone, type: 'REMOTE' | 'WALK_IN', services: string[], barberPreference: string, status: 'WAITING' | 'CALLED' | 'IN_CHAIR' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW', assignedBarber, station, serviceStartedAt, estimatedDuration, joinedAt)
   - SalonSettings (masterQueueOpen, closingTime, autoCutoffMinutes)
2. In src/data/mockData.ts, export initial data matching the 4 sample barbers, 8 services, and 5 initial active tokens specified in docs/02-screens.md.
3. In src/utils/waitTime.ts, implement the wait time calculation formula:
   (Total Service Minutes of Customers Ahead) / (Active On-Duty Working Barbers)
   Include specific stylist calculation and the Zero-Barber Guard fallback.
4. In src/store/useQueueStore.ts, implement the reactive queue store with actions:
   - joinQueue(customerData) [with duplicate phone guard and max 3 services guard]
   - callNextCustomer(barberId) [with smart FIFO barber preference matching]
   - startService(tokenId)
   - completeService(tokenId)
   - markNoShow(tokenId)
   - cancelToken(tokenId)
   - toggleBarberStatus(barberId, status)
   - toggleMasterQueue(isOpen)
```

#### Verification & Testing Criteria
* Unit tests or console tests confirm:
  * Duplicate phone submission throws an error or returns validation failure.
  * Calling "Next" for Barber 2 correctly skips a customer requesting Barber 1.
  * Setting all barbers to `ON_BREAK` triggers the `Queue Paused` fallback without crashing.

---

### Step 3: Screens 1, 2, 3 – Customer Mobile Experience

#### Goal
Build the customer-facing mobile journey: Salon Home (`/`), Remote Join Queue Form (`/join`), and Live Status Tracker (`/status/:id`) with approaching warnings and "It's your turn" callout.

#### Files to Create / Modify
* `src/pages/customer/HomePage.tsx`
* `src/pages/customer/JoinQueuePage.tsx`
* `src/pages/customer/StatusTrackerPage.tsx`
* `src/components/customer/ServiceSelector.tsx`
* `src/components/customer/BarberRadioGrid.tsx`
* `src/components/customer/TurnAlertModal.tsx`

#### Copy-Paste Prompt for Coding Agent
```text
Execute Step 3 of the Salon Queue System build plan:
1. Implement HomePage.tsx (/):
   - Luxury hero layout with serif typography, floral emblem, and live wait-time banner.
   - Primary buttons: "Join The Queue Now" -> /join and "Track Existing Token" -> opens prompt/modal.
   - On-duty barber preview avatars with status pills.
2. Implement JoinQueuePage.tsx (/join):
   - 3-step clean mobile form: Contact Details, Service Selection, Barber Preference.
   - Phone number input with 10-digit validation and active duplicate phone guard.
   - Service grid allowing up to 3 services with duration, ₹ price, and max-3 selection guard.
   - Stylist selection: "Any Barber (Fastest)" or specific barber cards.
   - Sticky bottom summary bar with live estimated wait time, duration, and submit button.
3. Implement StatusTrackerPage.tsx (/status/:id):
   - Displays giant token badge (e.g., A-102), live rank ("2nd in line"), and countdown timer.
   - Visual progress stepper: Waiting -> Approaching -> Called -> In Chair -> Completed.
   - Amber alert banner when position <= 2: "Please head to the salon lounge now."
   - Full-screen TurnAlertModal when status transitions to 'CALLED', displaying Station Number with celebration animation and audio chime.
   - Self-service "Leave Queue" button with confirmation modal.
```

#### Verification & Testing Criteria
* Form validates phone number and caps service selection at 3.
* Submitting redirects to `/status/:id` with new token (e.g. `A-106`).
* When token status is updated to `CALLED`, the full-screen alert modal immediately triggers.

---

### Step 4: Screen 4 – Receptionist Tablet Command Center

#### Goal
Build the 2-column widescreen tablet dashboard for the salon front desk, featuring real-time station overviews, queue triage controls, and the 10-second Walk-In registration modal.

#### Files to Create / Modify
* `src/pages/reception/ReceptionDashboard.tsx`
* `src/components/reception/ActiveChairsGrid.tsx`
* `src/components/reception/WaitingQueueTable.tsx`
* `src/components/reception/WalkInModal.tsx`
* `src/components/reception/NoShowTimerModal.tsx`

#### Copy-Paste Prompt for Coding Agent
```text
Execute Step 4 of the Salon Queue System build plan:
1. Implement ReceptionDashboard.tsx (/reception):
   - Top action bar with live salon statistics, queue search bar, and "+ Register Walk-In" button.
   - Two-column tablet responsive layout (Active Stations on Left, Waiting Queue on Right).
2. Implement ActiveChairsGrid.tsx:
   - Station cards for all 4 barbers displaying barber status, client token, elapsed timer, and quick action buttons ("Mark Done", "Take Break", "Call Next").
3. Implement WaitingQueueTable.tsx:
   - Tabular queue view with Rank, Token, Customer, Services, Requested Barber, Elapsed Wait, and action buttons ("Call", "Grace Timer / No-Show", "Bump Priority", "Cancel").
4. Implement WalkInModal.tsx:
   - High-speed front-desk entry form for walk-ins.
   - Generates tokens with 'W-' prefix and appends strictly to the end of the queue.
5. Implement NoShowTimerModal.tsx:
   - 10-minute grace period timer with auto-ejection when expired.
```

#### Verification & Testing Criteria
* Receptionist can register a walk-in in under 15 seconds; token appears with `W-` prefix.
* Receptionist can click "Call Next" on a vacant station to assign the next eligible client.
* Triggering Grace Period displays countdown and ejects token to `NO_SHOW` on expiry.

---

### Step 5: Screens 5 & 6 – Barber Mirror & Waiting TV Wall Display

#### Goal
Build the distraction-free Barber Mirror Station view (`/barber/:name`) and the 1080p full-screen Waiting Area TV Display (`/display`) with Web Audio chime synthesis.

#### Files to Create / Modify
* `src/pages/barber/BarberStationPage.tsx`
* `src/components/barber/ChairStopwatch.tsx`
* `src/pages/display/TvDisplayPage.tsx`
* `src/components/display/StationServingCard.tsx`
* `src/components/display/WaitingTicker.tsx`
* `src/utils/audioChime.ts`

#### Copy-Paste Prompt for Coding Agent
```text
Execute Step 5 of the Salon Queue System build plan:
1. Implement audioChime.ts using Web Audio API:
   - Synthesizes a clean, elegant 2-tone melodic chime (520Hz -> 660Hz) with soft decay. No external audio file dependencies.
2. Implement BarberStationPage.tsx (/barber/:name):
   - Dedicated station view with barber profile and On-Duty / On-Break shift toggle.
   - Active Chair Container: Displays client token, services, and live Stopwatch timer with progress bar against estimated minutes.
   - Controls: "Start Service", "Done / Complete", and "Call Next Customer".
   - Concurrency Lockout: Disable "Call Next" while a client is in the chair.
   - Next-in-line preview peek list.
3. Implement TvDisplayPage.tsx (/display):
   - 16:9 non-scrolling landscape view for 55"+ wall monitors.
   - Left side (60%): "Now Serving" grid for all 4 stations with large serif tokens (64px) and barber names.
   - Right side (40%): "Upcoming in Line" vertical ticker.
   - Flashes active station border in gold/terracotta and triggers audio chime whenever any barber calls a token.
```

#### Verification & Testing Criteria
* Barber cannot call a second customer while one is in the chair.
* TV screen flashes and plays audible chime when a customer is called from another tab.
* TV layout fits 1080p without any vertical or horizontal scrollbars.

---

### Step 6: Screen 7 – Owner Settings & Cross-Tab Synchronization

#### Goal
Build the Owner Admin Settings & Analytics screen (`/admin`) and wire up multi-tab synchronization using the `BroadcastChannel` API so updates reflect across all devices instantly without page refresh.

#### Files to Create / Modify
* `src/pages/admin/AdminDashboard.tsx`
* `src/components/admin/AnalyticsKpiCards.tsx`
* `src/components/admin/ServiceManager.tsx`
* `src/components/admin/BarberManager.tsx`
* `src/utils/broadcastSync.ts`

#### Copy-Paste Prompt for Coding Agent
```text
Execute Step 6 of the Salon Queue System build plan:
1. Implement broadcastSync.ts:
   - Connect the queue store to a 'salon_queue_sync_channel' BroadcastChannel.
   - Any state mutation (Join, Call, Start, Complete, Cancel, Settings) broadcasts an event to all open tabs and windows within < 500ms.
2. Implement AdminDashboard.tsx (/admin):
   - Master Queue Switch (Open / Closed toggle).
   - 30-minute auto cutoff rule settings.
   - Analytics KPI cards: Total Served, Avg Wait Time, Chair Utilization, Revenue, No-Shows.
   - Tab 1: Service Catalog Manager (Add/edit service, adjust duration and INR price).
   - Tab 2: Barber Staff Roster Manager (Add barber, adjust station and shift).
   - Tab 3: Daily Queue Audit Log with CSV Export.
```

#### Verification & Testing Criteria
* Open `/reception` in one browser window and `/display` in another; calling a token on reception updates the TV display instantly (< 1s).
* Toggling the Master Queue to "Closed" in `/admin` immediately disables the `/join` form on customer devices.

---

### Step 7: Edge Cases, Life Cycle Guards & Gujarati Audit

#### Goal
Audit and harden all business logic, enforce strict state machine guards, verify all Gujarati translations, and execute the 15-point verification checklist.

#### Files to Create / Modify
* `src/i18n/translations.ts` (Full Gujarati translation audit)
* `src/utils/guards.ts`
* `src/tests/queueValidation.test.ts`

#### Copy-Paste Prompt for Coding Agent
```text
Execute Step 7 of the Salon Queue System build plan:
1. Audit all UI strings in translations.ts to ensure 100% parity in Gujarati ('gu'). Ensure Gujarati translations for technical salon terms (e.g., Beard Sculpt, Fades, Detox, Station, Waiting).
2. Implement lifecycle guard assertions:
   - Prevent illegal state jumps (e.g., WAITING -> COMPLETED or IN_CHAIR -> WAITING).
   - Verify phone number duplicate guard is active across remote and walk-in flows.
   - Verify Zero-Barber Guard pauses wait times gracefully when all staff are on break.
3. Run through all 15 test items in docs/03-flows-rules.md and verify all passing criteria.
```

#### Verification & Testing Criteria
* Zero untranslated keys in Gujarati mode.
* State machine throws clear warnings or prevents illegal state transitions.
* All 15 checklist points verified.

---

### Step 8: Production Build, Deployment & Documentation

#### Goal
Prepare the project for production build, configure Vercel routing redirects for client-side routing, and generate the master README.md.

#### Files to Create / Modify
* `vercel.json`
* `README.md`
* Production bundle check (`npm run build`)

#### Copy-Paste Prompt for Coding Agent
```text
Execute Step 8 of the Salon Queue System build plan:
1. Create vercel.json with SPA rewrite rule:
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
2. Generate a comprehensive README.md detailing:
   - Project Overview and Luxury Design Language.
   - Live URL routes for all 7 screens.
   - Installation and local development instructions (`npm install`, `npm run dev`).
   - Production build command (`npm run build`).
3. Verify clean TypeScript compilation with zero errors.
```

#### Verification & Testing Criteria
* `npm run build` completes with 0 errors and generates optimized static assets in `/dist`.
* Direct navigation to deep routes (e.g., `/barber/Vikram` or `/status/tok-101`) resolves properly without 404s.
