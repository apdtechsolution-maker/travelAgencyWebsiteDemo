# Aura Voyages — Luxury 3D Travel Platform

An immersive, high-end travel website and itinerary planner featuring an interactive 3D WebGL globe, curated bespoke itineraries originating from Vadodara, transparent quote calculation, visa hub assistance, and seamless dark/light atmospheric styling.

---

## ✦ Key Highlights

- **Interactive 3D WebGL Globe**:
  - Built with **Three.js**, **React Three Fiber**, and **@react-three/drei**.
  - Photorealistic Earth rendering with day/night texture transitions, specular ocean maps, normal bump mapping, and a rotating cloud layer.
  - Custom GLSL atmosphere rim-lighting shader.
  - Interactive 3D destination beacons and animated great-circle flight arcs from Vadodara (origin hub).
  - Orbit controls with auto-rotation dampening and mobile touch gesture support.

- **Curated Itineraries & Multi-Criteria Filtering**:
  - Filter journeys by budget in INR, flight duration from Vadodara, group types, and cuisine needs (e.g. dedicated Jain kitchens and pure vegetarian dining).
  - Rich itinerary drawer with full day-by-day schedules, hotel stays, activity highlights, and transparent price breakdowns.
  - One-click branded quote export rendered dynamically to downloadable PNG cards.

- **In-House Visa Concierge**:
  - Dynamic visa requirement and checklist generator customized by traveler occupation (salaried, business owner, student, retired) and destination country.

- **Modern Architecture**:
  - Powered by **Next.js 16 (Turbopack, App Router)** and **React 19**.
  - Modern styling with **Tailwind CSS v4** and fluid typography (**Outfit**, **Cormorant Garamond**, and **JetBrains Mono**).
  - PostgreSQL schema and migrations managed with **Drizzle ORM**.
  - Integrated API routes for inquiry capture (`/api/leads`) and health monitoring (`/api/health`).

---

## ✦ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/) |
| **3D & Graphics** | [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei) |
| **Styling & Icons** | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/), `pg` |
| **Languages** | [TypeScript](https://www.typescriptlang.org/), [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) |

---

## ✦ Repository Structure

```text
├── frontend/                     # Next.js frontend application
│   ├── public/
│   │   ├── fonts/                # Self-hosted Outfit, Cormorant Garamond & JetBrains Mono woff2 fonts
│   │   └── globe/                # Earth textures (day, night, normal, specular, clouds)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── health/       # Healthcheck API route
│   │   │   │   └── leads/        # Lead & booking capture API route
│   │   │   ├── fonts.css         # Font face definitions
│   │   │   ├── globals.css       # Tailwind v4 theme, CSS variables & typography rules
│   │   │   ├── layout.tsx        # Root HTML layout and theme script
│   │   │   └── page.tsx          # Homepage view
│   │   ├── components/
│   │   │   ├── globe/
│   │   │   │   ├── GlobeScene.tsx # Three.js Canvas, Earth mesh, shaders & markers
│   │   │   │   └── GlobeStage.tsx # Globe viewport with WebGL fallback & boarding pass
│   │   │   ├── AppShell.tsx      # Main application state and section coordinator
│   │   │   ├── Catalog.tsx       # Filterable trip cards and catalog
│   │   │   ├── ChatBot.tsx       # AI trip planning concierge
│   │   │   ├── DestinationStrip.tsx
│   │   │   ├── GroupDepartures.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ItineraryDrawer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Stories.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── VisaHub.tsx
│   │   ├── db/
│   │   │   ├── index.ts          # PostgreSQL connection client
│   │   │   └── schema.ts         # Drizzle schema definitions
│   │   └── lib/
│   │       ├── data.ts           # Curated destination packages and flight routes
│   │       └── filters.ts        # Filtering logic
│   ├── drizzle.config.json       # Drizzle Kit configuration
│   ├── next.config.ts            # Next.js configuration
│   ├── package.json
│   └── tsconfig.json
├── .gitignore                    # Root gitignore
└── README.md                     # Project documentation
```

---

## ✦ Getting Started

### Prerequisites

- **Node.js**: `v18.18+` or `v20+`
- **npm**: `v9+` (or `pnpm` / `yarn`)
- **PostgreSQL**: Optional for local DB features (leads / booking inquiries)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/apdtechsolution-maker/travelAgencyWebsiteDemo.git
   cd travelAgencyWebsiteDemo/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   Create a `.env.local` file in `frontend/` if you wish to connect PostgreSQL:
   ```env
   DATABASE_URL="postgres://username:password@localhost:5432/aura_voyages"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Available Scripts

Inside the `frontend/` directory:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Builds the application for production |
| `npm run start` | Runs the built production server |
| `npm run typecheck` | Validates TypeScript types across the codebase |
| `npm run lint` | Runs ESLint to check for code issues |

---

## ✦ Assets & Credits

- Earth textures sourced via [Three.js planets texture collection](https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets) and NASA Visible Earth datasets.
- Custom fonts via [Google Fonts](https://fonts.google.com/) (*Outfit*, *Cormorant Garamond*, *JetBrains Mono*).

---

## ✦ License

This project is licensed under the [MIT License](LICENSE).

