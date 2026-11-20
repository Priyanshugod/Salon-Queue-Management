# Chérie Salon & Grooming - Real-Time Queue Management System

A production-ready Real-Time Salon Queue Management web application built with **React**, **Vite**, and **Tailwind CSS**. Designed with the luxury, editorial salon aesthetic (*Chérie Salon & Spa*), featuring bilingual support (**English & Gujarati**), real-time cross-device sync, and smart FIFO dispatching.

---

## 🌟 Live Screens & Routes

| Screen | Route | Description |
| :--- | :--- | :--- |
| **Customer Home** | `/` | Salon hero banner, live wait-time pulse card, stylist preview, and token tracker modal. |
| **Join Queue** | `/join` | Multi-step remote registration with phone duplicate guard, max-3 service selection, and stylist preference. |
| **Live Status Tracker** | `/status/:id` | Dynamic rank, estimated countdown clock, approach warning alerts, and full-screen "It's Your Turn" modal. |
| **Receptionist Dashboard** | `/reception` | Front-desk tablet 2-column command center, active workstation overview, walk-in quick-entry modal, and priority triage. |
| **Barber Mirror Station** | `/barber/:name` | Mirror tablet interface with live service stopwatch, on-duty/break toggles, and single-chair concurrency lockout. |
| **Waiting Area TV Display** | `/display` | 16:9 full-screen 1080p landscape display with "Now Serving" grid, animated column pulses, and Web Audio melodic chimes. |
| **Owner Admin & Analytics** | `/admin` | Master queue toggle switch, daily revenue and customer KPIs, service catalog controls, and staff roster. |

---

## 🚀 Deploying to Vercel

### Option 1: Deploy with Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via GitHub / GitLab / Bitbucket
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit of Chérie Salon Queue System"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Vercel automatically detects Vite:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. The `vercel.json` file ensures client-side routing (`/(.*) -> /index.html`) works without 404 errors on deep routes.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🎨 Visual Design Palette (Chérie Luxury Aesthetic)
- **Canvas Background**: `#FAF7F2` (Warm Ivory)
- **Primary Accent**: `#E07A5F` (Terracotta Coral)
- **Contrast Text**: `#1F1F1F` (Dark Charcoal) & `#5A5550` (Muted Warm Gray)
- **Hairline Borders**: `#E8E0D8`
- **Headings**: `Playfair Display` (Serif)
- **UI / Body**: `Plus Jakarta Sans` (Sans-Serif)
