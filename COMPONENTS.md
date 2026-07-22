# COMPONENTS.md — Go Burger Premium

> Exhaustive inventory of every component in the Go Burger codebase.
> Each component documented with props, state, dependencies, reusability, and complexity.

---

## 1. Site Components

### 1.1 `Logo` — `src/components/site/Logo.tsx:1`

| Property | Value |
|----------|-------|
| **Purpose** | Brand mark: flame icon + "GO BURGER" wordmark |
| **Props** | `{ compact?: boolean }` — hides text when true |
| **Dependencies** | `Link` (TanStack Router), `Flame` (lucide-react) |
| **State** | None |
| **Reusable** | ✅ Yes — Header + Footer |
| **Coupled** | Low (only to routing via Link) |
| **Complexity** | Low (22 lines) |

**JSX:** `Link[to="/"]` → flame icon circle (`group-hover:rotate-12`) + wordmark (`font-display text-xl`)

---

### 1.2 `Header` — `src/components/site/Header.tsx:1`

| Property | Value |
|----------|-------|
| **Purpose** | Sticky header: nav, search, account, cart badge |
| **Props** | None |
| **Dependencies** | `Logo`, `useCart`, 5 lucide icons |
| **State** | `count` from `useCart()` |
| **Reusable** | ✅ Yes — rendered in `__root.tsx` |
| **Coupled** | Medium (depends on `useCart`) |
| **Complexity** | Low-Medium (69 lines) |

**Layout:** `header` (sticky, backdrop-blur-lg) → `div` (max-w-7xl) → Logo + nav + actions

**Navigation links:** Menu (`/menu`), Offers (`/offers`), About (`/about`), Contact (`/contact`)

**Actions:** Search button, "Deliver to Downtown" button, Account link (`/account`), Cart link (`/cart`) with count badge, Mobile hamburger

**Accessibility:** `aria-label` on Search, Account, Menu buttons

**Issues:**
- Search button has no `onClick` (non-functional)
- Mobile hamburger has no `onClick` (non-functional)
- All nav uses `<a>` instead of `<Link>` (full page reload)

---

### 1.3 `Footer` — `src/components/site/Footer.tsx:1`

| Property | Value |
|----------|-------|
| **Purpose** | 4-column footer with brand, links, social |
| **Props** | None |
| **Dependencies** | `Logo`, 4 lucide icons (Instagram, Facebook, Twitter, Youtube) |
| **State** | None |
| **Reusable** | ✅ Yes |
| **Complexity** | Low (99 lines) |

**Internal:** `FooterCol({ title, links: Array<[string, string]> })` — renders column header + link list

**Columns:** Brand (logo + description + social), Order (Menu, Offers, Combos, Gift cards), Company (About, Careers, Franchise, Press), Support (Contact, Locations, FAQ, Track order)

---

## 2. Route Components

### 2.1 Root Route — `src/routes/__root.tsx`

| Property | Value |
|----------|-------|
| **Purpose** | App shell: HTML document, providers, layout, error/404 |
| **Route** | `createRootRouteWithContext` (provides `{ queryClient }`) |
| **Lines** | 156 |

**Internal Components:**

| Component | Lines | Purpose |
|-----------|-------|---------|
| `NotFoundComponent` | 18-38 | 404: "Off the menu" + "Back to home" |
| `ErrorComponent` | 42-78 | Error: "Something burned" + "Try again" + "Go home" |
| `RootShell` | 126-138 | HTML shell: `<html>`, `<head>`, `<HeadContent>`, `<body>`, `<Scripts>` |
| `RootComponent` | 140-153 | Providers + layout: `QueryClientProvider` → `CartProvider` → `Header` → `<Outlet>` → `Footer` |

**Provider hierarchy:** `QueryClientProvider` → `CartProvider` → layout div

---

### 2.2 Home Page — `src/routes/index.tsx`

| Property | Value |
|----------|-------|
| **Purpose** | Landing page: hero, search, categories, offers, products, combos |
| **Route** | `/` |
| **Lines** | 499 (largest file) |
| **State** | None (entirely static) |
| **Hooks** | None |

**Internal Components (all non-exported):**

| Component | Lines | Purpose | Props |
|-----------|-------|---------|-------|
| `HomePage` | 43-60 | Root layout, composes all sections | — |
| `Hero` | 64-160 | Hero section: gradient blobs, burger image, floating cards | `children` |
| `SearchBar` | 163-180 | Search input UI (non-functional) | `children` |
| `CategoryRail` | 183-218 | Category cards grid | — |
| `Offers` | 220-260 | Offer cards with gradient borders | — |
| `PopularSection` | 262-277 | Popular products grid | `items: Product[]` |
| `ProductCard` | 279-323 | Product card: image, badge, add button | `product: Product` |
| `CombosSection` | 325-375 | Combo deal cards | — |
| `SignaturesSection` | 377-394 | Signature products grid | `items: Product[]` |
| `PromoBand` | 396-426 | Rewards promo band (gradient bg) | — |
| `ValueProps` | 428-468 | 3 value proposition cards | — |
| `SectionHeader` | 470-499 | Section title + optional action link | `{ eyebrow, title, action?, href? }` |

**Derived data:**
- `signatures = products.filter(p => p.category === "signatures")` (line 44)
- `popular = products.slice(0, 4)` (line 45)

**Issues:**
- Search bar has no `onChange`/`onClick` — completely non-functional
- ProductCard "Add to cart" button has no `onClick`
- All navigation uses `<a>` instead of `<Link>`

---

### 2.3 Menu Page — `src/routes/menu.tsx`

| Property | Value |
|----------|-------|
| **Purpose** | Full menu with search, category nav, product cards |
| **Route** | `/menu` |
| **Lines** | 210 |
| **State** | 2 `useState`, 1 `useEffect`, 2 `useMemo` |

**State:**

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `active` | `string` | `"signatures"` | Visible category (IntersectionObserver-synced) |
| `query` | `string` | `""` | Search input text |

**Derived:**
- `filtered` (`useMemo`): products matching query against name/tagline (case-insensitive)
- `grouped` (`useMemo`): categories with filtered `.items`

**Internal Components:**

| Component | Lines | Purpose |
|-----------|-------|---------|
| `MenuPage` | 27-129 | Search bar, sticky category pills, product grid |
| `MenuCard` | 131-209 | Product card with name, tagline, price, add-to-cart stepper |

**Key behavior:**
- `IntersectionObserver` (line 32-45): watches `<section id={c.id}>` elements, updates `active`
- Category pills are sticky (`sticky top-16 z-30`), scroll to section on click
- `MenuCard` shows quantity stepper when item is in cart (reads `lines` from `useCart`)
- Search filters in real-time

---

### 2.4 Product Detail — `src/routes/menu.$slug.tsx`

| Property | Value |
|----------|-------|
| **Purpose** | Product page with extras, modifiers, instructions, recommendations |
| **Route** | `/menu/:slug` (dynamic) |
| **Lines** | 281 |
| **State** | 4 `useState` |
| **Loader** | Yes — finds product by slug or `notFound()` |

**Loader:**
```typescript
loader: ({ params }) => {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) throw notFound();
  return { product };
}
```

**State:**

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `qty` | `number` | `1` | Quantity to add |
| `extras` | `string[]` | `[]` | Selected extra IDs |
| `mods` | `string[]` | `[]` | Selected modifier strings |
| `notes` | `string` | `""` | Special instructions |

**Module-level constants:**

| Constant | Values |
|----------|--------|
| `EXTRAS` | Extra cheese ($1.50), Smoked beef ($2.00), Burnt onion jam ($1.00), Jalapenos ($0.75), Truffle aioli ($1.75) |
| `MODIFIERS` | "No pickles", "No onion", "No sauce", "Gluten-free bun" |

**Derived:**
- `extraTotal`: sum of selected extras prices
- `total`: `(product.price + extraTotal) * qty`
- `recommendations`: first 4 products excluding current

**Issues:**
- Thumbnail gallery shows same image 4 times
- Thumbnail buttons have no click handler
- "Ingredients" text and "32g protein" are hardcoded for all products

---

### 2.5 Cart Page — `src/routes/cart.tsx`

| Property | Value |
|----------|-------|
| **Purpose** | Shopping cart: line items, coupon, order summary |
| **Route** | `/cart` |
| **Lines** | 249 |
| **State** | 3 `useState` |

**State:**

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `coupon` | `string` | `""` | Coupon input (auto-uppercased) |
| `applied` | `string \| null` | `null` | Applied coupon code |
| `notes` | `string` | `""` | Order notes |

**Derived:**
- `discount`: `applied === "EMBER20" ? subtotal * 0.2 : 0`
- `deliveryFee`: `subtotal >= 25 || subtotal === 0 ? 0 : 3.99`
- `total`: `Math.max(0, subtotal - discount + deliveryFee)`

**Internal:** `Row({ label, value, accent? })` — summary row component

**Empty state:** ShoppingBag icon + "Your bag is empty" + "Browse the menu" link

---

### 2.6 Checkout Page — `src/routes/checkout.tsx`

| Property | Value |
|----------|-------|
| **Purpose** | 4-step wizard: Address → Delivery → Payment → Review |
| **Route** | `/checkout` |
| **Lines** | 414 |
| **State** | 6 `useState` |

**State:**

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `step` | `number` | `0` | Current step (0-3) |
| `address` | `string` | `"home"` | Selected address |
| `delivery` | `"delivery" \| "pickup"` | `"delivery"` | Delivery mode |
| `time` | `string` | `"asap"` | Timing |
| `payment` | `string` | `"card"` | Payment method |
| `placed` | `boolean` | `false` | Confirmation state |

**Derived:**
- `fee`: `delivery === "pickup" || subtotal >= 25 ? 0 : 3.99`
- `total`: `subtotal + fee`

**Internal Components:**

| Component | Lines | Purpose | Props |
|-----------|-------|---------|-------|
| `Panel` | 369-382 | Card container with title | `{ title, children }` |
| `Choice` | 384-413 | Selectable option with check indicator | `{ active, onClick, children }` |

**Order placement (line 307-309):**
```typescript
onClick={() => { clear(); setPlaced(true); }}
```
Simply clears cart and shows confirmation. No API call.

**Issues:**
- Stepper is clickable (can skip steps)
- "Add new address" button has no handler
- All addresses/payment methods are hardcoded

---

### 2.7 Account Page — `src/routes/account.tsx`

| Property | Value |
|----------|-------|
| **Purpose** | User dashboard: 5 tabbed sections |
| **Route** | `/account` |
| **Lines** | 288 |
| **State** | 1 `useState` |

**State:** `tab: "orders" | "favorites" | "addresses" | "profile" | "rewards"` (initial: `"orders"`)

**Internal Components:**

| Component | Lines | Purpose |
|-----------|-------|---------|
| `OrdersTab` | 118-148 | 3 hardcoded past orders + reorder button |
| `FavoritesTab` | 150-179 | 4 favorite products + heart icon |
| `AddressesTab` | 181-218 | 3 saved addresses + edit/add buttons |
| `ProfileTab` | 220-246 | Editable form (name, email, phone) + Save button |
| `RewardsTab` | 248-288 | 1,248 points, progress bar, 3 redeemable rewards |

**Hardcoded data:** User "Alex Jordan", 1,248 Ember points, 3 orders, 3 addresses, 3 rewards

**Issues:** All action buttons (Reorder, Save, Edit, Add, Redeem) have no onClick handlers

---

### 2.8 Contact Page — `src/routes/contact.tsx`

| Property | Value |
|----------|-------|
| **Purpose** | Contact: branch locations, map, form |
| **Route** | `/contact` |
| **Lines** | 259 |
| **State** | 2 `useState` |

**State:** `active` (branch ID, initial "downtown"), `sent` (form submitted, initial false)

**Module constant:** `BRANCHES` — 3 branches with id, name, addr, phone, hours, lat, lng

**Internal Components:**

| Component | Lines | Purpose | Props |
|-----------|-------|---------|-------|
| `Field` | 219-235 | Form input with label | `{ label, ...InputHTMLAttributes }` |
| `InfoRow` | 237-259 | Info card with icon | `{ Icon, title, body }` |

**Map:** OpenStreetMap embed iframe, URL built from branch lat/lng

**Form:** `onSubmit` sets `sent = true` (no actual submission)

---

### 2.9 About Page — `src/routes/about.tsx`

65 lines. Static page: brand story paragraph, hero image, 3 value cards. No state, no hooks.

### 2.10 Offers Page — `src/routes/offers.tsx`

60 lines. Renders `[...offers, ...offers]` (duplicates 3 offers to show 6 cards). No state.

---

## 3. UI Library Components (shadcn/ui)

All 46 components are **stock shadcn/ui "new-york" style** — zero customization from defaults.

### Usage Status: 0 of 46 used in routes

Every route uses native HTML elements (`<button>`, `<input>`, `<textarea>`, `<a>`) with inline Tailwind classes instead of shadcn/ui components.

| Category | Components | Used |
|----------|-----------|------|
| Layout (6) | AspectRatio, Card, Resizable, ScrollArea, Separator, Table | 0 |
| Navigation (7) | Accordion, Breadcrumb, Menubar, NavigationMenu, Pagination, Tabs, Sidebar | 0 |
| Form (13) | Button, Checkbox, Form, Input, InputOTP, Label, RadioGroup, Select, Slider, Switch, Textarea, Toggle, ToggleGroup | 0 |
| Overlay (9) | AlertDialog, Dialog, Drawer, DropdownMenu, HoverCard, Popover, Sheet, Tooltip, ContextMenu | 0 |
| Data Display (9) | Alert, Avatar, Badge, Calendar, Carousel, Chart, Progress, Skeleton, Sonner | 0 |
| Command (1) | Command | 0 |

---

## 4. Component Dependency Graph

```
__root.tsx
├── QueryClientProvider
├── CartProvider (lib/cart.tsx)
│   └── useCart() consumed by:
│       ├── Header.tsx (count)
│       ├── menu.tsx (add, lines, updateQty)
│       ├── menu.$slug.tsx (add)
│       ├── cart.tsx (lines, updateQty, remove, subtotal)
│       └── checkout.tsx (lines, subtotal, clear)
├── Header.tsx
│   ├── Logo.tsx
│   └── useCart()
├── Footer.tsx
│   └── Logo.tsx
└── <Outlet /> → child routes

index.tsx → categories, combos, offers, products (menu-data.ts)
menu.tsx → useCart(), categories, products
menu.$slug.tsx → useCart(), products
cart.tsx → useCart()
checkout.tsx → useCart()
account.tsx → products
contact.tsx → (none)
about.tsx → (none)
offers.tsx → offers
```

---

## 5. Reuse Assessment

### Reusable (extract to `src/components/`)

| Component | File | Pattern |
|-----------|------|---------|
| `SectionHeader` | `routes/index.tsx:470` | Generic section title + action |
| `Field` | `routes/contact.tsx:219` | Form field with label |
| `InfoRow` | `routes/contact.tsx:237` | Info card with icon |
| `Row` | `routes/cart.tsx:232` | Summary row (label + value) |
| `Panel` | `routes/checkout.tsx:369` | Card container with title |
| `Choice` | `routes/checkout.tsx:384` | Selectable option card |

### Duplicated Patterns

- `ProductCard` (index.tsx:279) vs `MenuCard` (menu.tsx:131) — same concept, different implementation
- Delivery fee logic duplicated in cart.tsx:31 and checkout.tsx:46
- Navigation uses `<a>` tags everywhere instead of `<Link>`
