# Project Brief: Real-Time Salon Queue Management System

## 1. Executive Summary & Problem Statement

### 1.1 The Weekend Salon Bottleneck
High-end and boutique salons experience acute customer congestion, particularly during peak weekend windows and festive seasons. Traditional walk-in management models create significant operational friction:
* **Waiting Room Overcrowding:** Crowded waiting lounges degrade customer comfort, overwhelm physical seating capacity, and dilute the luxury ambiance of the salon.
* **Opaque Wait Times:** Customers receive vague verbal approximations (e.g., *"about 15-20 minutes"*), which routinely stretch into 45–60 minutes. This discrepancy leads to customer frustration, verbal disputes with reception staff, and high walkout rates.
* **Disorganized Barber Chair Turnovers:** Barbers lose operational rhythm as they manually check front desk clipboards or shout into the waiting area to locate their next client, causing lost billable minutes between appointments.
* **Barber Preference Imbalances:** Clients who prefer specific master stylists bottleneck the queue, while other capable barbers remain underutilized. Conversely, clients willing to see "Any Available Barber" are caught behind dedicated stylist waits.
* **Lost Revenue & Ghost Bookings:** Traditional phone reservations fail due to high no-show rates, while unmanaged walk-ins leave when seeing a crowded entry, draining potential weekend salon gross revenues.

### 1.2 The Solution
The **Real-Time Salon Queue Management System** is a mobile-responsive, synchronized digital queue platform designed with the warm, refined visual aesthetic of luxury boutique salons (inspired by *Chérie Salon*). It replaces physical waiting lines with a digital line that customers can join remotely or via the front desk, providing:
1. Instant remote queue joining with live wait-time forecasting.
2. Dynamic cross-device status tracking with proactive "It's your turn!" alerts.
3. Multi-viewport operational alignment (Receptionist iPad, Barber Station, and TV Wall Display).
4. Dual-language accessibility (English and Gujarati) tailored for local regional adoption.

---

## 2. Target Personas

| Persona | Role | Key Goals & Needs | Primary Device / Interface | Pain Points Addressed |
| :--- | :--- | :--- | :--- | :--- |
| **Remote Customer** | Digital Consumer | Join queue while traveling or at a nearby cafe; know precise live position and estimated arrival time. | Mobile Smartphone (`/`, `/join`, `/status/:id`) | Eliminates wasted physical waiting; removes uncertainty of salon delays. |
| **Walk-in Customer** | On-Premise Patron | Register quickly at the door, receive a digital token, view their position on the waiting lounge wall TV. | Front Desk Interaction / Lounge TV (`/display`) | Guarantees fair FIFO queuing; visible progress on high-visibility wall TV. |
| **Receptionist** | Front-Desk Host | Register walk-in clients, monitor barber stations, handle no-shows, override queue when emergencies arise. | iPad / Tablet (`/reception`) | Eliminates paper clipboards, chaotic lobby triage, and customer shouting. |
| **Barber / Stylist** | Service Provider | See who is up next, view requested services, start service timers, signal completion with 1 tap. | Mobile or Tablet Mount at Mirror (`/barber/:name`) | Eliminates ambiguity on client selection; prevents chair double-booking. |
| **Salon Owner** | Business Director | Control daily queue capacity, enforce 30-min closing cutoffs, manage services and staff rosters, view operational flow. | Laptop / Desktop / Tablet (`/admin`) | Provides macro-visibility over salon throughput, chair utilization, and peak loads. |

---

## 3. Project Objectives & Success Metrics

* **Elimination of Lobby Bottlenecks:** Reduce in-salon physical customer dwell time prior to chair seating by **65%**.
* **Real-Time Synchronicity:** Sub-second to max 3-second state broadcast synchronization across customer smartphones, reception iPads, barber mirror tablets, and the lounge TV wall screen via shared reactive storage / broadcast sync.
* **Accurate Predictive Wait Modeling:** Deliver algorithmic wait-time estimates based on aggregate cumulative service durations divided by active on-duty staff, dynamically updated every minute.
* **Zero Chair Collisions:** Enforce a strict single-chair concurrency rule where a barber station can only have exactly one active client in service at any given millisecond.
* **Bilingual Inclusivity:** Provide complete 100% localization parity across English and Gujarati with instantaneous runtime switching.

---

## 4. Scope & Out-of-Scope Boundaries

To maintain strict operational focus, stability, and fast turnaround, system boundaries are defined as follows:

```
+---------------------------------------------------------------------------------------+
|                                    PROJECT SCOPE                                      |
+---------------------------------------------------------------------------------------+
|  IN SCOPE                                          STRICTLY OUT OF SCOPE              |
|  ------------------------------------------------  ---------------------------------  |
|  [x] Remote client queue registration              [ ] Online payment processing      |
|  [x] Multi-service selection (up to 3 services)   [ ] Future calendar bookings       |
|  [x] Barber preference selection (Specific / Any)  [ ] SMS / WhatsApp API gateways    |
|  [x] Active phone number duplicate check guard    [ ] Customer loyalty points        |
|  [x] Live dynamic position & countdown tracker     [ ] Multi-branch salon management  |
|  [x] Audio chime & visual call alerts on TV Wall   [ ] User password authentication   |
|  [x] Reception desk walk-in queue injection        [ ] Inventory / stock management   |
|  [x] Barber workstation timers (Start -> Done)     [ ] Staff payroll calculation      |
|  [x] No-show 10-minute timeout ejection flow                                          |
|  [x] Full bilingual toggle (English & Gujarati)                                       |
|  [x] Owner master queue toggle & 30-min auto cutoff                                   |
+---------------------------------------------------------------------------------------+
```

### Detailed Exclusions Rationale:
1. **No Online Payment Processing / POS:** Payment happens physically at the reception counter post-service. Integrating payment gateways introduces checkout friction and abandoned queue joins.
2. **No Future Calendar Appointments:** This is purely a **same-day real-time queue platform**. It is designed to optimize immediate salon flow, not calendar scheduling.
3. **No External SMS / WhatsApp Dependencies:** External telecom APIs introduce billing overhead, template approvals, and network delivery delays. In-app Web Audio alerts, visual badge flashes, and live URL status trackers provide zero-latency updates without telecom dependencies.
4. **No Customer Login Passwords:** Access to status tracking is token/session-based via direct URL (`/status/:id`) and persistent client storage.

---

## 5. Core Feature Matrix

### 5.1 Remote Check-In & Service Selection
* **Name & Contact Collection:** Clean input form capturing Customer Name and a validated 10-digit Indian mobile number (`[6-9][0-9]{9}`).
* **Duplicate Active Entry Guard:** Prevents a phone number with an active waiting or in-service token from re-joining the queue.
* **Multi-Service Selection:** Allows selecting up to 3 services simultaneously (e.g., *Haircut + Beard Sculpt + Charcoal Face Scrub*).
* **Stylist Routing Selection:** Choice between a specific requested barber or *"Any Barber (Fastest Available)"*.
* **Real-Time Pre-Join Estimate:** Displays the estimated wait time and number of clients ahead before the user confirms submission.

### 5.2 Real-Time Live Status Tracker (`/status/:id`)
* **Instant Token Generation:** Produces clean alphanumeric tokens (e.g., `A-101`, `W-104`).
* **Dynamic Position Counter:** Real-time badge showing current rank in line (e.g., *"2nd in line"*).
* **Algorithmic Countdown Clock:** Dynamic countdown showing estimated minutes remaining, recalculating in real-time as barbers finish early or run over.
* **Proactive "Approach the Salon" Alert:** Triggers a high-contrast amber alert banner when the customer reaches position #2 or #1.
* **Full-Screen "It's Your Turn!" Callout:** When the barber presses *"Call Next"*, the customer's phone triggers an animated alert modal with audio chime instructions to report directly to Station X.
* **Self-Service Cancellation:** Explicit *"Leave Queue"* option with confirmation dialog to free up the queue cleanly.

### 5.3 Receptionist Tablet Command Center (`/reception`)
* **Dual Queue Views:** Tabular / Card view showing both waiting queue and active workstation chairs.
* **Walk-In Direct Check-In Modal:** Front-desk quick-entry form that inserts walk-in clients at the bottom of the queue with distinct `W-` prefix tokens.
* **Smart Dispatch & Manual Override:** Ability to call next, bump priorities in medical/elderly cases, or manually reassign a customer.
* **No-Show Handling:** Puts absent clients on a 10-minute grace timer; automatically marks them *"No-Show"* or enables 1-click re-queueing at the bottom.
* **Barber Roster Quick-Toggles:** Mark barbers as *Available*, *Busy*, or *On Break*.

### 5.4 Barber Mirror Workstation (`/barber/:name`)
* **Dedicated Station View:** Clean, distraction-free interface mounted on the barber's mirror.
* **Smart Next-in-Line Dispatch:** Clicking *"Call Next"* automatically picks the next customer requesting this specific barber or any customer who selected *"Any Barber"*, preserving global FIFO order.
* **Single-Chair Lockout:** The station strictly locks out additional calls while a service is marked *In Chair*.
* **Service Stopwatch / Timer:** Live elapsed service timer tracking actual minutes vs. estimated service duration.
* **Service Complete Trigger:** One-click *"Done / Service Complete"* button that transitions the client to *Completed*, records duration, and prompts to call the next client.

### 5.5 Waiting Area TV Wall Display (`/display`)
* **High-Impact Landscape Grid:** Non-scrolling, high-visibility 1080p/4K responsive layout engineered for 55"+ lounge displays.
* **Now Serving Stage:** Displays active barber chairs, barber photo/name, client token, and station number.
* **Waiting Queue Ticker:** Clean multi-column list of upcoming tokens with their requested barber or *"Any"*.
* **Audio-Visual Chime:** When any barber triggers *"Call Next"*, the TV flashes the corresponding barber column in gold/terracotta accent and plays an audible, clean multi-tone chime via the Web Audio API.

### 5.6 Owner Settings & Analytics (`/admin`)
* **Master Queue Toggle:** Emergency switch to open or close the queue instantly (e.g., when the salon is over-capacity).
* **30-Minute Auto-Cutoff Rule:** Automatic queue closure 30 minutes prior to official salon closing time (e.g., closes queue at 8:30 PM for a 9:00 PM close).
* **Service Catalog Management:** Add, edit, or disable services, adjust base service duration (in minutes), and set pricing in INR (₹).
* **Barber Roster Management:** Add or remove barbers, update station assignments, set photos, and adjust shift statuses.
* **Daily Performance Metrics:** Real-time counts of total customers served, average wait time, average service turnaround, and no-show count.

### 5.7 Bilingual Localization Engine
* **Supported Languages:** English (EN) and Gujarati (GU).
* **Persistent Header Toggle:** Accessible across all screens in the top-right navigation bar.
* **Zero Page-Reload:** Instantaneous dictionary-driven string translation across all UI elements, status badges, forms, and alerts.
