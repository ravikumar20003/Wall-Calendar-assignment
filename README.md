# 📅 Interactive Wall Calendar Component

A polished, interactive React wall calendar component built as a frontend engineering challenge. It features a physical wall calendar aesthetic, day range selection, integrated notes, dark/light mode, and full responsiveness.

---

## ✨ Features

- **Wall Calendar Aesthetic** — Spiral binding, hero image panel with month-specific gradient themes
- **Day Range Selector** — Click start → end date with live hover preview and clear visual states
- **Integrated Notes** — Monthly notes, per-day notes (right-click), and date range notes
- **12 Unique Month Themes** — Each month has its own gradient, emoji, color accent, and label
- **Dark / Light Mode Toggle** — Full theme switch with smooth transitions
- **Holiday Markers** — Indian public holidays highlighted with amber dots
- **LocalStorage Persistence** — All notes survive page refresh
- **Fully Responsive** — Side-by-side on desktop, stacked on mobile

---

## 🛠 Tech Stack

| Tool | Reason |
|---|---|
| **React 18** | Component architecture, hooks for state |
| **CSS-in-JS (inline styles)** | Zero dependencies, full dynamic theming |
| **localStorage** | Client-side note persistence (no backend needed) |
| **Google Fonts** | Playfair Display + Source Serif 4 for editorial feel |

---

## 📁 Project Structure

```
wall-calendar/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── WallCalendar.jsx   # Main calendar component (all-in-one)
│   ├── App.jsx
│   └── index.js
├── README.md
└── package.json
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/wall-calendar.git
cd wall-calendar

# 2. Install dependencies
npm install

# 3. Start the development server
npm start

# App will open at http://localhost:3000
```

### Build for Production

```bash
npm run build
```

---

## 🎨 Design Decisions

### Aesthetic Direction
I chose a **refined editorial** style inspired by physical Scandinavian wall calendars — clean typography (Playfair Display for headings, Source Serif 4 for body), warm paper tones in light mode, and deep navy in dark mode. The spiral binding at the top is a signature physical detail rendered digitally.

### Component Architecture
The entire calendar lives in a single `WallCalendar.jsx` file for portability. Internal concerns (theme data, date utilities, sub-components like `HeroImage` and `SpiralBind`) are organized at the top of the file. State is managed entirely with `useState` and `useEffect` — no external state library needed at this scale.

### Notes System
Three levels of notes were implemented:
1. **Monthly** — General month-level memo in the left panel
2. **Per-day** — Right-click any date to open a focused modal note editor
3. **Date range** — When a range is selected, a range note textarea appears below the grid

All notes are keyed and stored in `localStorage`, so they persist across sessions without any backend.

### Responsiveness
- **Desktop (>700px):** Side-by-side layout — hero image left, calendar grid right
- **Mobile (≤700px):** Hero image stacks above the calendar grid; day cells shrink proportionally; all interactions remain touch-friendly

### Color Theming
Each of the 12 months has a unique gradient, accent color, and emoji. The active month's gradient is reused across the range selection bar and the save button to create visual coherence.

---

## 📱 Responsive Breakpoint

| Screen | Layout |
|---|---|
| Desktop (>700px) | Side-by-side: Hero image left, Calendar right |
| Mobile (≤700px) | Stacked: Hero image top, Calendar below |

---

## 🗓 Holiday Data

Includes major Indian public holidays:
- New Year's Day (Jan 1)
- Republic Day (Jan 26)
- Ambedkar Jayanti (Apr 14)
- Independence Day (Aug 15)
- Gandhi Jayanti (Oct 2)
- Children's Day (Nov 14)
- Christmas Day (Dec 25)

---

## 🚀 Deployment (Netlify)

Your component can be deployed to Netlify in two simple ways:

### Option 1: Drag & Drop (easiest)

1. Build your project locally:
   ```bash
   npm run build

## 🖥 Live Demo

> (https://wall-calendar-react-f88b96.netlify.app/)

---

## 📹 Video Demo

> [https://www.loom.com/share/b7406ed188a943a88a5f30123d552cda]

---

## 👤 Author

**Ravi Kumar**  
[ravikumarrohit17@gmail.com]  
[github.com/ravikumar20003](https://github.com/ravikumar20003)
