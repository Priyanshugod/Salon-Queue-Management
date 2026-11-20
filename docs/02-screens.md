# Screen Specifications & Visual Design System

## 1. Visual Design System (Extracted from Template Photo)

The visual design system is directly derived from the luxury salon reference design (*Chérie Salon & Spa* aesthetic). It features a warm, inviting, editorial atmosphere that blends refined serif typography, warm ivory canvas tones, delicate terracotta coral accents, and hairline borders.

### 1.1 Color Palette

```
+-----------------------------------------------------------------------------------------+
|                                    CHÉRIE COLOR SYSTEM                                  |
+-----------------------------------------------------------------------------------------+
| TOKEN                      HEX CODE     TAILWIND UTILITY         ROLE                   |
| -------------------------  -----------  -----------------------  ---------------------- |
| Canvas Background          #FAF7F2      bg-[#FAF7F2]             Main page background   |
| Surface Card               #FFFFFF      bg-white                 Primary content card   |
| Surface Tint / Highlight   #F7EFEB      bg-[#F7EFEB]             Secondary soft card    |
| Primary Accent (Terracotta)#E07A5F      bg-[#E07A5F]             Primary CTA, hero tag  |
| Primary Accent Hover       #D36B50      hover:bg-[#D36B50]       Button hover state     |
| Secondary Accent (Coral)   #E57B62      text-[#E57B62]           Subtle accent lines    |
| Dark Charcoal (High Cont.) #1F1F1F      text-[#1F1F1F]           Headings & titles      |
| Body Muted Charcoal        #5A5550      text-[#5A5550]           Body copy, descriptions|
| Hairline Border            #E8E0D8      border-[#E8E0D8]         Card & input borders   |
| Deep Contrast Fill         #1A1A1A      bg-[#1A1A1A]             Dark solid buttons     |
+-----------------------------------------------------------------------------------------+
| STATUS ACCENT PALETTE                                                                   |
| -------------------------  -----------  -----------------------  ---------------------- |
| Available / On Duty        #3D7C57      bg-[#3D7C57], text-white Active barber status   |
| Available Light Tint       #EAF3ED      bg-[#EAF3ED], text-[#3D7C57] Available badge pill   |
| Busy / In-Chair            #E07A5F      bg-[#E07A5F], text-white In-chair active token  |
| Busy Light Tint            #FDF0EC      bg-[#FDF0EC], text-[#E07A5F] In-service badge pill  |
| On Break / Paused          #C59B3F      bg-[#C59B3F], text-white Barber on rest break   |
| On Break Light Tint        #FDF7E7      bg-[#FDF7E7], text-[#C59B3F] On-break badge pill   |
| Approaching Warning        #D96B43      bg-[#D96B43], text-white Urgency alert banner   |
+-----------------------------------------------------------------------------------------+
```

### 1.2 Typography System

The typography creates a luxury editorial magazine feel:
* **Display & Heading Font:** `Playfair Display` or `Cormorant Garamond` (Google Fonts: serif, high contrast, elegant letterforms).
* **Body & UI Font:** `Plus Jakarta Sans` or `Montserrat` (Google Fonts: clean geometric sans-serif, high legibility on mobile screens).
* **Hierarchy Scale:**
  * **Hero Display H1:** `font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#1F1F1F]`
  * **Section H2:** `font-serif text-2xl sm:text-3xl font-normal text-[#1F1F1F]`
  * **Card Header H3:** `font-serif text-xl sm:text-2xl font-normal text-[#1F1F1F]`
  * **Kicker / Overline:** `font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#E07A5F]`
  * **Body Regular:** `font-sans text-sm sm:text-base text-[#5A5550] leading-relaxed`
  * **Microcopy & Metadata:** `font-sans text-xs text-[#8C847E]`
  * **Token Large Badge:** `font-serif text-4xl sm:text-6xl font-semibold tracking-wider text-[#1F1F1F]`

### 1.3 Component Styling & Design Tokens
* **Corner Radius:**
  * Outer Cards & Modals: `rounded-2xl` (16px)
  * Inner Panels & Form Fields: `rounded-xl` (12px)
  * Badges, Tags & Pill Buttons: `rounded-full` (9999px)
* **Borders:**
  * Hairline 1px borders: `border border-[#E8E0D8]`
  * Active / Focus Ring: `focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40 focus:border-[#E07A5F]`
* **Shadows:**
  * Soft Ambient Elevation: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`
  * Active Hover Elevation: `hover:shadow-[0_12px_40px_rgb(224,122,95,0.12)]`
  * No harsh black drop shadows.
* **Button Variations:**
  * **Primary Terracotta Pill:** `bg-[#E07A5F] hover:bg-[#D36B50] text-white px-8 py-3.5 rounded-full font-sans text-xs sm:text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 shadow-sm active:scale-[0.98]`
  * **Secondary Outline Pill:** `border border-[#1F1F1F] text-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white px-8 py-3.5 rounded-full font-sans text-xs sm:text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300`
  * **Tertiary Ghost Pill:** `bg-transparent text-[#E07A5F] hover:text-[#D36B50] px-4 py-2 font-sans text-xs tracking-wider uppercase font-semibold`

---

## 2. Common Layout Wrappers & Navigation

### 2.1 Global Header Strip
* **Sticky Top Navigation (`h-16 border-b border-[#E8E0D8] bg-[#FAF7F2]/90 backdrop-blur-md`):**
  * Left: Brand Logo (`Chérie Salon & Grooming` in serif with subtle coral monogram `CS`).
  * Center (Tablet/Desktop): Navigation Links (`Home`, `Join Queue`, `Reception`, `Display`, `Barber Stations`, `Admin`).
  * Right:
    * Live Salon Status Pill (`● Queue Open` in sage green or `○ Queue Closed` in coral).
    * Language Switcher (`EN | ગુજરાતી` toggle pill).

---

## 3. Detailed Screen Specifications

### Screen 1: Customer Mobile Home (`/`)
* **Layout Structure:** Mobile-first single column, centered layout (`max-w-md mx-auto min-h-screen px-4 py-6`).
* **Visual Elements:**
  * **Hero Header:**
    * Monogram icon and decorative floral flourish.
    * Kicker: `"BOUTIQUE SALON & GROOMING"`.
    * Heading: `"Welcome to Chérie"`.
    * Subtitle: `"Experience effortless luxury. Join our real-time digital queue from anywhere and arrive just in time for your chair."`
  * **Live Salon Pulse Card (`bg-white rounded-2xl p-6 border border-[#E8E0D8] shadow-sm`):**
    * 3-metric quick view:
      1. Current Wait: `~15 mins` (calculated in real-time).
      2. Customers in Line: `3 guests`.
      3. Active Barbers on Duty: `3 stylists`.
  * **Primary Action Bar:**
    * Primary CTA Button: `JOIN THE QUEUE NOW` (links to `/join`).
    * Secondary Outline Button: `TRACK EXISTING TOKEN` (prompts for Token ID or opens existing stored session).
  * **Barber Roster Preview:**
    * Horizontal scrolling avatars showing today's on-duty stylists with status badge (`Available` or `Busy`).
  * **Salon Operating Details:**
    * Hours: `10:00 AM – 9:00 PM (Queue closes at 8:30 PM)`.
    * Location: `High Street Avenue, Luxury Suite #4`.

---

### Screen 2: Remote Join Queue Screen (`/join`)
* **Layout Structure:** Stepped single column (`max-w-lg mx-auto px-4 py-8`).
* **Header:** Progress indicator: `Step 1: Contact -> Step 2: Services -> Step 3: Stylist`.
* **Form Sections:**
  1. **Step 1: Guest Information:**
     * Name input (`placeholder="Your Full Name"`).
     * Mobile Number input (`placeholder="10-digit mobile number"`, with `+91` prefix badge).
     * Validation rule: Required, exactly 10 digits (`/^[6-9]\d{9}$/`).
     * Duplicate Check Guard: If number is already active in queue, an inline alert displays: *"An active queue token is already associated with this number."* with a button to view existing status.
  2. **Step 2: Service Selection (Max 3):**
     * Interactive card grid (2 columns on mobile) displaying services.
     * Each card includes: Service Name, Duration (`25 mins`), Price (`₹450`), and checkbox indicator.
     * Guard: Counter badge `Selected: 2/3`. Selecting a 4th service shows a tooltip: *"Maximum 3 services can be selected per visit"*.
  3. **Step 3: Barber Preference:**
     * Option A: `Any Barber (Fastest Available)` - Highlighted with a gold star badge and lowest wait-time estimate.
     * Option B: `Specific Stylist` - Selectable list of on-duty barbers with their avatar, name, specialty, and individual wait time.
  4. **Live Floating Summary Footer:**
     * Sticky bottom card showing:
       * Total Estimated Service Duration: `55 mins`.
       * Estimated Wait Time: `~20 mins`.
       * Total Estimated Amount: `₹950`.
       * CTA Button: `CONFIRM & JOIN QUEUE`.
* **Empty / Closed State:** If queue is toggled off by admin, form is disabled with message: *"The queue is currently closed for the day. Please visit during open hours."*

---

### Screen 3: Live My Status Tracker (`/status/:id`)
* **Layout Structure:** Mobile-first focused dashboard (`max-w-md mx-auto px-4 py-8 space-y-6`).
* **Components:**
  1. **Token Identification Card:**
     * Giant serif Token Badge: `A-102` (Walk-ins: `W-104`).
     * Created timestamp: `Joined at 2:14 PM`.
     * Current Status Pill: `Waiting` / `Approaching` / `Called` / `In Chair` / `Completed`.
  2. **Live Dynamic Stepper / Progress Bar:**
     * Visual stages: `In Queue` -> `Approaching (Top 2)` -> `Called` -> `In Chair` -> `Done`.
  3. **Real-Time Dynamic Metrics Card (`bg-white rounded-2xl p-6 border border-[#E8E0D8]`):**
     * Position Indicator: `2nd in line` (large serif font).
     * Countdown Timer: `~14 mins estimated wait`.
     * Assigned / Requested Stylist: `Aarav Mehta` (or `Any Available Stylist`).
     * Station Number: `Station 2` (populated once called).
  4. **Selected Services Breakdown:**
     * List of selected services with individual prices and durations.
  5. **Dynamic Alert Modals & Banners:**
     * **Approaching Alert (Position <= 2):** High-contrast amber/coral banner:
       > *"You're almost up! Please make your way to the Chérie waiting lounge."*
     * **"It's Your Turn!" Full-Screen Modal (State = CALLED):**
       * Vibrating/pulsing coral badge: `Station 2 is Ready for You!`.
       * Message: `Please proceed to Aarav's station. Your chair is waiting.`
       * In-browser audio chime played upon trigger.
  6. **Self-Service Leave Queue Button:**
     * Subdued outline button: `Leave Queue`.
     * Triggers confirmation dialog: *"Are you sure you want to leave the queue? You will forfeit your token position."*

---

### Screen 4: Receptionist Tablet Dashboard (`/reception`)
* **Layout Structure:** Tablet 2-column widescreen layout (`w-full max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6`).
* **Header Command Bar:**
  * Salon quick statistics: Active Barbers: `4/4` | Waiting in Line: `7` | Avg Wait: `18m`.
  * Search Bar: Filter queue by Customer Name or Token ID.
  * Primary Action: `+ REGISTER WALK-IN CUSTOMER` button (opens Walk-in Modal).
* **Left Column (Col-Span 5) - Active Workstation Chairs:**
  * Card for each barber chair (Station 1 through 4).
  * Barber info: Name, avatar, status pill (`Available`, `Busy`, `On Break`).
  * Active client in chair: Token, name, service, and live stopwatch timer (`18m / 35m`).
  * Direct action buttons: `Mark Done`, `Put on Break`, `Call Next`.
* **Right Column (Col-Span 7) - Live Waiting Queue Table:**
  * Clean tabular layout with columns:
    * `Rank`: `#1`, `#2`, `#3`...
    * `Token & Client`: Token pill (`A-101`), Name, Phone number.
    * `Services`: Pill list of services + total duration.
    * `Stylist`: Specific name or `Any Barber`.
    * `Wait Elapsed`: Time spent in queue (`12m ago`).
    * `Actions`:
      * `Call to Chair` (assign to specific free barber).
      * `Mark No-Show` (initiates 10-minute timer).
      * `Bump Priority` (move up for VIP/elderly).
      * `Remove / Cancel`.
* **Walk-In Registration Modal:**
  * Quick-entry form designed for 10-second front desk entry.
  * Inputs: Client Name, Optional Mobile Number, Multi-service selection, Barber assignment.
  * Generates instant `W-` prefix token and appends strictly to the end of FIFO queue.

---

### Screen 5: Barber Mirror Workstation (`/barber/:name`)
* **Layout Structure:** Minimalist, high-touch tablet interface designed for mounted mirror use (`max-w-2xl mx-auto px-6 py-8`).
* **Header:**
  * Station number: `Station 1 - Master Mirror`.
  * Barber Profile: Photo avatar, Barber Name (`Vikram Patel`).
  * Shift Status Toggle: Pill switch `On Duty (Active)` vs `On Break (Paused)`.
* **Current Active Client Card (Hero Container):**
  * If client in chair:
    * Token: `A-103`.
    * Customer Name: `Rahul Sharma`.
    * Requested Services: `Classic Haircut + Beard Sculpt` (Total: 45 mins).
    * **Live Service Timer (Stopwatch):**
      * Large digital timer: `23:45`.
      * Progress bar showing elapsed time vs. 45 min target.
    * **Action Controls:**
      * Primary Button: `DONE / COMPLETE SERVICE` (turns green upon click, clears chair, prompts for next).
  * If chair is vacant:
    * Vacant chair illustration / icon.
    * Status: `Ready for Next Guest`.
    * Primary CTA: `CALL NEXT IN LINE` (automatically pulls the next customer wanting this barber or 'Any Barber').
* **Next in Line Preview (Queue Peek):**
  * List of next 3 customers assigned or eligible for this station.
* **Single-Chair Lockout:** When a customer is in the chair, the `CALL NEXT` button is disabled to enforce single-chair occupancy.

---

### Screen 6: Waiting Area Wall TV Display (`/display`)
* **Layout Structure:** Full-screen 16:9 non-scrolling landscape view (`h-screen w-screen overflow-hidden bg-[#FAF7F2] p-8 flex flex-col justify-between`).
* **Header Strip (Top):**
  * Brand Monogram: `CHÉRIE SALON & GROOMING`.
  * Current Live Time: Digital clock `02:45 PM` with date.
  * Queue Status: `● ACTIVE QUEUE` (Wait time estimate: `~15 mins`).
* **Main Stage (Split Grid 60% Left / 40% Right):**
  * **Left Side - "Now Serving" Stations Grid:**
    * 2x2 grid of station cards (Station 1 through 4).
    * Card Anatomy:
      * Station Number Badge: `STATION 01`.
      * Stylist Avatar & Name: `Vikram Patel`.
      * Large Token Callout: `A-102` (in 64px bold Playfair serif font).
      * Service Title: `Haircut & Beard Trim`.
      * Visual Animation: When a customer is called, the corresponding station card pulses with an amber glow border and plays a 2-tone melodic chime.
  * **Right Side - "Upcoming in Line" Waiting Ticker:**
    * Elegant vertical list of the next 6-8 tokens.
    * Columns: `TOKEN`, `STYLIST PREFERENCE`, `EST. WAIT`.
    * Clean ivory cards with hairline borders.
* **Footer Ticker:**
  * Continuous luxury ticker:
    > *"Welcome to Chérie • Please take a complimentary beverage • Remote queue available at cherie.salon • When your token flashes, please proceed to the indicated station"*

---

### Screen 7: Owner Settings & Analytics (`/admin`)
* **Layout Structure:** Full responsive desktop/tablet dashboard with tabbed navigation (`max-w-6xl mx-auto px-6 py-8 space-y-8`).
* **Top Global Controls:**
  * **Master Queue Toggle:** Large toggle switch `Queue Open` vs `Queue Closed` (with confirmation modal).
  * **30-Minute Auto-Cutoff Setting:** Automatic cutoff active before 9:00 PM closing.
* **Key Performance Indicator (KPI) Cards:**
  1. `Total Served Today`: `38 guests`.
  2. `Average Wait Time`: `16.4 mins`.
  3. `Average Chair Duration`: `32.1 mins`.
  4. `No-Show Rate`: `4.8% (2 no-shows)`.
  5. `Estimated Daily Revenue`: `₹24,850`.
* **Management Tabs:**
  * **Tab 1: Service Catalog:**
    * Table of 8 services with inline edit: Service Name, Duration (mins), Price (INR), Status (Active / Disabled).
    * Button: `+ Add New Service`.
  * **Tab 2: Barber Staff Roster:**
    * Staff list with photo upload, Station assignment, Active shift toggle.
    * Button: `+ Add Barber`.
  * **Tab 3: Queue History & Reset:**
    * Daily audit trail of all tokens with exact timestamps (Joined, Called, Started, Finished, Cancelled).
    * Button: `Download Daily CSV` and `Reset Queue for Tomorrow`.

---

## 4. Production Dummy Data Sets

### 4.1 Sample Barbers Roster

```json
[
  {
    "id": "barber-1",
    "name": "Vikram Patel",
    "station": "Station 1",
    "specialty": "Master Stylist & Beard Specialist",
    "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    "status": "BUSY",
    "currentChairToken": "A-101",
    "completedToday": 9
  },
  {
    "id": "barber-2",
    "name": "Aarav Mehta",
    "station": "Station 2",
    "specialty": "Classic Fades & Scalp Treatments",
    "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    "status": "BUSY",
    "currentChairToken": "W-102",
    "completedToday": 8
  },
  {
    "id": "barber-3",
    "name": "Kavita Shah",
    "station": "Station 3",
    "specialty": "Creative Styling & Hair Coloring",
    "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    "status": "AVAILABLE",
    "currentChairToken": null,
    "completedToday": 7
  },
  {
    "id": "barber-4",
    "name": "Rohan D'Souza",
    "station": "Station 4",
    "specialty": "Modern Textures & Royal Shaves",
    "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    "status": "ON_BREAK",
    "currentChairToken": null,
    "completedToday": 6
  }
]
```

### 4.2 Salon Service Catalog (8 Services)

```json
[
  {
    "id": "srv-1",
    "name": "Signature Haircut & Consultation",
    "nameGu": "સિગ્નેચર હેરકટ અને કન્સલ્ટેશન",
    "durationMinutes": 30,
    "priceINR": 450,
    "category": "Hair",
    "active": true
  },
  {
    "id": "srv-2",
    "name": "Executive Beard Sculpt & Hot Towel",
    "nameGu": "એક્ઝિક્યુટિવ દાઢી સ્તંભ અને ગરમ ટુવાલ",
    "durationMinutes": 20,
    "priceINR": 300,
    "category": "Beard",
    "active": true
  },
  {
    "id": "srv-3",
    "name": "Chérie Haircut + Beard Combo",
    "nameGu": "ચેરી હેરકટ + દાઢી કોમ્બો",
    "durationMinutes": 45,
    "priceINR": 700,
    "category": "Combo",
    "active": true
  },
  {
    "id": "srv-4",
    "name": "Charcoal Detox Facial & Scrub",
    "nameGu": "ચારકોલ ડિટોક્સ ફેશિયલ અને સ્ક્રબ",
    "durationMinutes": 30,
    "priceINR": 650,
    "category": "Skin",
    "active": true
  },
  {
    "id": "srv-5",
    "name": "Relaxing Head Massage & Oil Therapy",
    "nameGu": "રીલેક્સિંગ હેડ મસાજ અને ઓઇલ થેરાપી",
    "durationMinutes": 25,
    "priceINR": 400,
    "category": "Wellness",
    "active": true
  },
  {
    "id": "srv-6",
    "name": "Beard Grey Blending & Touch-up",
    "nameGu": "દાઢી કલર અને ટચ-અપ",
    "durationMinutes": 20,
    "priceINR": 350,
    "category": "Color",
    "active": true
  },
  {
    "id": "srv-7",
    "name": "Deep Conditioning Hair Spa",
    "nameGu": "ડીપ કન્ડીશનીંગ હેર સ્પા",
    "durationMinutes": 40,
    "priceINR": 900,
    "category": "Hair",
    "active": true
  },
  {
    "id": "srv-8",
    "name": "Royal Shave & Anti-Stress Cold Mask",
    "nameGu": "રોયલ શેવ અને એન્ટી-સ્ટ્રેસ માસ્ક",
    "durationMinutes": 25,
    "priceINR": 500,
    "category": "Beard",
    "active": true
  }
]
```

### 4.3 Sample Active Queue Tokens

```json
[
  {
    "id": "tok-101",
    "token": "A-101",
    "customerName": "Karan Singhania",
    "phone": "9820012345",
    "type": "REMOTE",
    "services": ["srv-3"],
    "barberPreference": "barber-1",
    "status": "IN_CHAIR",
    "assignedBarber": "barber-1",
    "station": "Station 1",
    "serviceStartedAt": "2026-11-20T14:00:00Z",
    "estimatedDuration": 45,
    "joinedAt": "2026-11-20T13:40:00Z"
  },
  {
    "id": "tok-102",
    "token": "W-102",
    "customerName": "Manish Parekh",
    "phone": "9898011223",
    "type": "WALK_IN",
    "services": ["srv-1"],
    "barberPreference": "barber-2",
    "status": "IN_CHAIR",
    "assignedBarber": "barber-2",
    "station": "Station 2",
    "serviceStartedAt": "2026-11-20T14:05:00Z",
    "estimatedDuration": 30,
    "joinedAt": "2026-11-20T14:00:00Z"
  },
  {
    "id": "tok-103",
    "token": "A-103",
    "customerName": "Devang Trivedi",
    "phone": "9723456789",
    "type": "REMOTE",
    "services": ["srv-1", "srv-2"],
    "barberPreference": "ANY",
    "status": "CALLED",
    "assignedBarber": "barber-3",
    "station": "Station 3",
    "serviceStartedAt": null,
    "estimatedDuration": 50,
    "joinedAt": "2026-11-20T14:02:00Z"
  },
  {
    "id": "tok-104",
    "token": "A-104",
    "customerName": "Nilesh Jadav",
    "phone": "9909012345",
    "type": "REMOTE",
    "services": ["srv-4"],
    "barberPreference": "barber-1",
    "status": "WAITING",
    "assignedBarber": null,
    "station": null,
    "serviceStartedAt": null,
    "estimatedDuration": 30,
    "joinedAt": "2026-11-20T14:08:00Z"
  },
  {
    "id": "tok-105",
    "token": "W-105",
    "customerName": "Pooja Desai",
    "phone": "9825098765",
    "type": "WALK_IN",
    "services": ["srv-7"],
    "barberPreference": "ANY",
    "status": "WAITING",
    "assignedBarber": null,
    "station": null,
    "serviceStartedAt": null,
    "estimatedDuration": 40,
    "joinedAt": "2026-11-20T14:10:00Z"
  }
]
```
