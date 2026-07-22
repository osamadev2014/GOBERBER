# ARCHITECTURE.md — Go Burger Premium

> Comprehensive engineering documentation for the Go Burger food ordering application.
> Generated for senior engineers who need to maintain or extend this codebase.

---

## 1. Project Purpose

Go Burger Premium is a **single-page food ordering website** for a fictional smash-burger restaurant chain. It is a fully front-end, client-side-rendered prototype with SSR capability — think a polished DoorDash/UberEats-style experience for a single restaurant brand.

**Brand identity:** "Fire. Craft. Speed." — dark, fire-themed aesthetic with ember/orange accent colors on a charcoal background.

**Current status:** High-fidelity frontend prototype. All data is hardcoded. No backend, no authentication, no persistence. The cart and checkout are purely in-memory React state.

**Built with:** [Lovable](https://lovable.dev) AI code generation platform.

---

## 2. Technology Stack

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.0 | UI library (latest React 19) |
| `react-dom` | ^19.2.0 | React DOM renderer |
| `typescript` | ^5.8.3 | Type safety |
| `vite` | ^8.0.16 | Build tool and dev server |
| `@tanstack/react-start` | ^1.168.26 | Full-stack React meta-framework with SSR |
| `@tanstack/react-router` | ^1.170.16 | File-based routing |
| `@tanstack/router-plugin` | ^1.168.18 | Auto-generates route tree |
| `nitro` | 3.0.260603-beta | Server runtime (via TanStack Start) |

### Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.2.1 | Utility-first CSS (v4 CSS-first config) |
| `@tailwindcss/vite` | ^4.2.1 | Tailwind Vite plugin |
| `tw-animate-css` | ^1.3.4 | Tailwind animation utilities |
| `tailwind-merge` | ^3.5.0 | Deduplicates conflicting Tailwind classes |
| `clsx` | ^2.1.1 | Conditional class name joining |
| `class-variance-authority` | ^0.7.1 | Component variant management (CVA) |

### Component Library (26 Radix Primitives)

| Package | Wraps |
|---------|-------|
| `@radix-ui/react-accordion` | Accordion |
| `@radix-ui/react-alert-dialog` | AlertDialog |
| `@radix-ui/react-aspect-ratio` | AspectRatio |
| `@radix-ui/react-avatar` | Avatar |
| `@radix-ui/react-checkbox` | Checkbox |
| `@radix-ui/react-collapsible` | Collapsible |
| `@radix-ui/react-context-menu` | ContextMenu |
| `@radix-ui/react-dialog` | Dialog + Sheet |
| `@radix-ui/react-dropdown-menu` | DropdownMenu |
| `@radix-ui/react-hover-card` | HoverCard |
| `@radix-ui/react-label` | Label |
| `@radix-ui/react-menubar` | Menubar |
| `@radix-ui/react-navigation-menu` | NavigationMenu |
| `@radix-ui/react-popover` | Popover |
| `@radix-ui/react-progress` | Progress |
| `@radix-ui/react-radio-group` | RadioGroup |
| `@radix-ui/react-scroll-area` | ScrollArea |
| `@radix-ui/react-select` | Select |
| `@radix-ui/react-separator` | Separator |
| `@radix-ui/react-slider` | Slider |
| `@radix-ui/react-slot` | Button (asChild), Breadcrumb |
| `@radix-ui/react-switch` | Switch |
| `@radix-ui/react-tabs` | Tabs |
| `@radix-ui/react-toggle` | Toggle |
| `@radix-ui/react-toggle-group` | ToggleGroup |
| `@radix-ui/react-tooltip` | Tooltip |

### Additional UI Libraries

| Package | Purpose |
|---------|---------|
| `cmdk` | Command palette |
| `embla-carousel-react` | Carousel |
| `input-otp` | OTP input |
| `react-day-picker` | Date picker |
| `react-resizable-panels` | Resizable panels |
| `recharts` | Charts |
| `sonner` | Toast notifications |
| `vaul` | Drawer |

### Forms & Validation (Installed but Unused)

| Package | Purpose |
|---------|---------|
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Zod resolver |
| `zod` | Schema validation |

### Data & State

| Package | Purpose |
|---------|---------|
| `@tanstack/react-query` | Server state (QueryClient created but zero `useQuery` calls) |

### Utilities

| Package | Purpose |
|---------|---------|
| `date-fns` | Date manipulation |
| `lucide-react` | Icon library (tree-shakeable) |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `@lovable.dev/vite-tanstack-config` | Lovable platform Vite config |
| `@vitejs/plugin-react` | React Fast Refresh |
| `vite-tsconfig-paths` | Resolves `@/` path aliases |
| `eslint` + plugins | Linting (flat config, TS + React hooks + Prettier) |
| `prettier` | Code formatter |
| `typescript-eslint` | TypeScript ESLint |
| `bunfig.toml` | Bun supply-chain security (24h minimum release age) |

---

## 3. Folder Structure

```
go-burger-premium-main/
├── .gitignore                    # dist, .output, .wrangler, .vinxi
├── .lovable/
│   └── project.json              # Lovable platform metadata
├── .prettierrc                   # 100 width, semicolons, double quotes, trailing commas
├── AGENTS.md                     # Lovable agent instructions
├── bun.lock / bunfig.toml        # Bun lockfile + supply-chain security
├── components.json               # shadcn/ui config (new-york, lucide, @/ aliases)
├── eslint.config.js              # ESLint 9 flat config
├── package.json                  # 52 dependencies
├── tsconfig.json                 # strict, ES2022, bundler resolution
├── vite.config.ts                # Vite + TanStack Start
├── public/
│   └── favicon.ico               # Only static asset
└── src/
    ├── assets/                   # 8 product/category JPGs (Vite module imports)
    ├── components/
    │   ├── site/                 # Header.tsx, Footer.tsx, Logo.tsx
    │   └── ui/                   # 46 shadcn/ui components (all stock, none customized)
    ├── hooks/
    │   └── use-mobile.tsx        # useIsMobile() — breakpoint 768px
    ├── lib/
    │   ├── cart.tsx              # CartContext + CartProvider + useCart (100 lines)
    │   ├── error-capture.ts      # Global error listeners (5s TTL buffer)
    │   ├── error-page.ts         # Static HTML error page renderer
    │   ├── lovable-error-reporting.ts # Lovable editor telemetry
    │   ├── menu-data.ts          # All product/category/combo/offer data (154 lines)
    │   └── utils.ts              # cn() = clsx + tailwind-merge
    ├── routes/
    │   ├── __root.tsx            # App shell: providers, Header, Footer, error/404
    │   ├── index.tsx             # Home (499 lines — largest file)
    │   ├── menu.tsx              # Menu listing + search + scroll-spy (210 lines)
    │   ├── menu.$slug.tsx        # Product detail + extras/modifiers (281 lines)
    │   ├── cart.tsx              # Cart + coupon system (249 lines)
    │   ├── checkout.tsx          # 4-step checkout wizard (414 lines)
    │   ├── account.tsx           # Account dashboard — 5 tabs (288 lines)
    │   ├── contact.tsx           # Contact + OpenStreetMap (259 lines)
    │   ├── about.tsx             # About page (65 lines)
    │   └── offers.tsx            # Offers page (60 lines)
    ├── routeTree.gen.ts          # Auto-generated (DO NOT EDIT, 239 lines)
    ├── router.tsx                # Router factory: QueryClient + context (16 lines)
    ├── server.ts                 # Nitro entry: SSR error recovery (61 lines)
    ├── start.ts                  # TanStack Start: error middleware (22 lines)
    └── styles.css                # Design system + CSS variables (179 lines)
```

### Directory Responsibilities

| Directory | Responsibility |
|-----------|---------------|
| `src/assets/` | Product images imported as Vite modules (hashed URLs, optimized) |
| `src/components/site/` | Reusable site-wide layout (Header, Footer, Logo) |
| `src/components/ui/` | shadcn/ui component library (46 primitives, mostly unused) |
| `src/hooks/` | Custom React hooks (only `useIsMobile`) |
| `src/lib/` | Core business logic, data, utilities, error handling |
| `src/routes/` | Page components (file-based routing) |
| `public/` | Static assets served at root (only favicon) |

---

## 4. Build System

```bash
bun dev          # Vite dev server with HMR
bun build        # Vite build → Nitro SSR → Cloudflare Workers
bun build:dev   # Development mode build
bun preview      # Preview production build
bun lint         # ESLint + TypeScript + React hooks + Prettier
bun format       # Prettier
```

**Path alias:** `@/` → `./src/` (tsconfig.json + vite-tsconfig-paths)

---

## 5. Error Handling Architecture (4 Layers)

### Layer 1: Global Error Capture (`src/lib/error-capture.ts`)
- Registers `window.addEventListener("error")` and `"unhandledrejection"` at import time
- Stores most recent error in 5-second TTL buffer
- `consumeLastCapturedError()` retrieves and clears

### Layer 2: TanStack Start Middleware (`src/start.ts`)
- Wraps every server request in try/catch
- Re-throws HTTP errors (with `statusCode`)
- Converts other errors to HTML error page (500)

### Layer 3: Nitro Server Entry (`src/server.ts`)
- Top-level `fetch` handler wrapping TanStack Start
- Detects h3 swallowed-error pattern: `{"unhandled":true,"message":"HTTPError"}`
- Replaces with HTML error page
- Catches thrown exceptions → HTML error page

### Layer 4: Client-Side Error Boundaries (`src/routes/__root.tsx`)
- `NotFoundComponent`: 404 page with "Back to home"
- `ErrorComponent`: error page with "Try again" (invalidate + reset) and "Go home"
- Reports to Lovable telemetry via `reportLovableError()`

---

## 6. Implementation Status

### Completed Features

| Feature | Status |
|---------|--------|
| Home page (hero, categories, offers, popular, combos, signatures) | ✅ |
| Menu listing (search, scroll-spy, add-to-cart) | ✅ |
| Product detail (extras, modifiers, instructions, recommendations) | ✅ |
| Shopping cart (quantity, remove, notes, coupon, delivery fee) | ✅ |
| Checkout flow (4-step wizard, order confirmation) | ✅ |
| Account dashboard (5 tabs: orders, favorites, addresses, profile, rewards) | ✅ |
| Contact page (3 branches, OpenStreetMap, contact form) | ✅ |
| About page | ✅ |
| Offers page | ✅ |
| Header/Footer with navigation | ✅ |
| SSR via TanStack Start + Nitro | ✅ |
| 4-layer error handling | ✅ |
| SEO (custom head meta + OpenGraph per route) | ✅ |

### Missing Features

| Feature | Priority |
|---------|----------|
| Backend API (all data hardcoded) | 🔴 Critical |
| Authentication (no login/register) | 🔴 Critical |
| Payment processing (checkout is UI-only) | 🔴 Critical |
| Cart persistence (lost on refresh) | 🟡 High |
| Real search (home page bar non-functional) | 🟡 High |
| Mobile menu (hamburger has no handler) | 🟡 High |
| Form validation (react-hook-form + zod installed, unused) | 🟡 High |
| Toast notifications (sonner installed, never imported) | 🟡 High |
| Real images per product (thumbnails show same image 4x) | 🟡 Medium |
| Order tracking | 🟡 Medium |
| Address management (add/edit buttons no-ops) | 🟡 Medium |
| Profile editing (save button no-op) | 🟡 Medium |
| Reorder functionality (button no-op) | 🟡 Medium |
| Favorites toggle (heart icon visual only) | 🟡 Medium |
| Rewards redemption (redeem buttons no-ops) | 🟡 Medium |
| Code splitting / lazy loading | 🟢 Low |
| i18n / Localization | 🟢 Low |
| Dark/light mode toggle | 🟢 Low |
| Page transitions / entrance animations | 🟢 Low |

---

## 7. Key Architectural Decisions

### Why TanStack Start (not Next.js)?
File-based routing with full type safety, SSR via Nitro, Cloudflare Workers deployment. Avoids App Router complexity.

### Why shadcn/ui (not MUI/Chakra)?
Full ownership of component code, no runtime external dependency, full Tailwind control. Trade-off: 46 components installed but mostly unused.

### Why Bun (not npm/yarn)?
Faster installs, supply-chain security via `bunfig.toml` minimum release age guard.

### Why oklch colors?
Perceptually uniform color space for consistent rendering across displays. All colors defined in `src/styles.css`.

### Why no state management library?
Cart is the only global state — small enough for React Context. TanStack Query ready for when backend is added.
