# DATA-FLOW.md — Go Burger Premium

> Complete documentation of how data enters, transforms, and exits the application.
> Covers every data source, type, transformation, and the path to API migration.

---

## 1. Data Sources

### 1.1 Product Data — `src/lib/menu-data.ts`

This is the **single source of truth** for all application data. It exports 4 constants and 1 type.

#### Type: `Product`

```typescript
export type Product = {
  id: string;        // Unique identifier (e.g., "p1")
  slug: string;      // URL-safe slug (e.g., "the-ember-double")
  name: string;      // Display name
  tagline: string;   // Short description
  price: number;     // Price in dollars (e.g., 12.5)
  image: string;     // Imported image URL (Vite module)
  category: string;  // Category ID reference
  badge?: string;    // Optional badge text (e.g., "Chef's pick", "New", "🔥 Hot")
  calories?: number; // Optional calorie count
};
```

#### Export: `categories` (5 items)

| id | name | image |
|----|------|-------|
| `signatures` | Signatures | `heroBurger` |
| `classics` | Classics | `burgerClassic` |
| `chicken` | Chicken | `catChicken` |
| `sides` | Sides | `catFries` |
| `shakes` | Shakes | `catShakes` |

#### Export: `products` (8 items)

| id | slug | name | price | category | badge | calories |
|----|------|------|-------|----------|-------|----------|
| p1 | the-ember-double | The Ember Double | $12.50 | signatures | Chef's pick | 780 |
| p2 | classic-cheese | Classic Cheese | $8.00 | classics | — | 540 |
| p3 | grilled-tower | Grilled Tower | $15.90 | signatures | New | 1180 |
| p4 | black-inferno | Black Inferno | $13.50 | signatures | 🔥 Hot | 690 |
| p5 | truffle-royale | Truffle Royale | $16.90 | signatures | — | 820 |
| p6 | crispy-tenders | Crispy Tenders | $9.50 | chicken | — | 610 |
| p7 | ember-fries | Ember Fries | $4.50 | sides | — | 380 |
| p8 | cocoa-shake | Cocoa Shake | $5.90 | shakes | — | 520 |

#### Export: `combos` (2 items)

| id | name | items | price | save |
|----|------|-------|-------|------|
| c1 | Ember Duo Meal | Ember Double + Fries + Shake | $18.90 | $3.90 |
| c2 | Family Feast | 4 Burgers · 2 Fries · 4 Drinks | $49.90 | $12.00 |

#### Export: `offers` (3 items)

| id | title | subtitle | accent |
|----|-------|----------|--------|
| o1 | Free delivery over $25 | Every order, every day. | ember |
| o2 | 20% off first order | Use code EMBER20 at checkout. | flame |
| o3 | Loyalty · Earn 1 point per $1 | Redeem for free burgers. | cream |

### 1.2 Contact Data — `src/routes/contact.tsx:34`

```typescript
const BRANCHES = [
  {
    id: "downtown",
    name: "Downtown Flagship",
    addr: "128 Ember Lane, Downtown",
    phone: "+1 (555) 128-4200",
    hours: "11:00 – 01:00 daily",
    lat: 40.712, lng: -74.006,
  },
  {
    id: "riverside",
    name: "Riverside",
    addr: "22 Sear Street, Riverside",
    phone: "+1 (555) 128-4211",
    hours: "11:30 – 23:00 daily",
    lat: 40.735, lng: -74.02,
  },
  {
    id: "midtown",
    name: "Midtown",
    addr: "500 Grill Ave, Midtown",
    phone: "+1 (555) 128-4222",
    hours: "10:00 – 00:00 daily",
    lat: 40.754, lng: -73.99,
  },
];
```

### 1.3 Account Data — `src/routes/account.tsx`

**Hardcoded user:** "Alex Jordan", 1,248 Ember points

**Orders (line 94):** 3 past orders with id, status, items, date, total

**Addresses (line 157):** Home, Work, Gym — each with label, address, primary flag

**Rewards (line 262):** Free fries (500 pts), Free shake (800 pts), Free signature burger (1500 pts)

### 1.4 Product Detail Constants — `src/routes/menu.$slug.tsx:29`

```typescript
const EXTRAS = [
  { id: "extra-cheese", label: "Extra cheese", price: 1.5 },
  { id: "smoked-beef", label: "Smoked beef", price: 2.0 },
  { id: "burnt-onion-jam", label: "Burnt onion jam", price: 1.0 },
  { id: "jalapenos", label: "Jalapenos", price: 0.75 },
  { id: "truffle-aioli", label: "Truffle aioli", price: 1.75 },
];

const MODIFIERS = ["No pickles", "No onion", "No sauce", "Gluten-free bun"];
```

### 1.5 Navigation Data — `src/components/site/Header.tsx:8`

```typescript
const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
```

### 1.6 Checkout Constants — `src/routes/checkout.tsx:35`

```typescript
const STEPS = ["Address", "Delivery", "Payment", "Review"] as const;
```

### 1.7 Account Tabs — `src/routes/account.tsx:33`

```typescript
const TABS = [
  { id: "orders", label: "Orders", Icon: Package },
  { id: "favorites", label: "Favorites", Icon: Heart },
  { id: "addresses", label: "Addresses", Icon: MapPin },
  { id: "profile", label: "Profile", Icon: User },
  { id: "rewards", label: "Rewards", Icon: Sparkles },
] as const;
```

---

## 2. How Products Are Loaded

All product data is imported statically at the top of each route file:

```typescript
// menu.tsx
import { categories, products } from "@/lib/menu-data";

// index.tsx
import { categories, combos, offers, products } from "@/lib/menu-data";

// menu.$slug.tsx
import { products } from "@/lib/menu-data";

// offers.tsx
import { offers } from "@/lib/menu-data";
```

**No dynamic loading.** No lazy imports. No code splitting. The entire product catalog (8 products) is bundled into every route that uses it.

**Images** are imported as Vite modules:
```typescript
import heroBurger from "@/assets/hero-burger.jpg";
// Returns hashed URL: /assets/hero-burger-abc123.jpg
```

---

## 3. How Categories Work

Categories are a flat array of `{ id, name, image }` objects. Products reference categories via the `category` field matching the category's `id`.

**Category → Products mapping:**
```typescript
// In menu.tsx
const grouped = categories.map((c) => ({
  ...c,
  items: filtered.filter((p) => p.category === c.id),
}));
```

**Category navigation (scroll-spy):**
```typescript
// IntersectionObserver watches <section id={c.id}> elements
// Updates `active` state when section enters viewport
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries.find((e) => e.isIntersecting);
    if (visible) setActive(visible.target.id);
  },
  { rootMargin: "-30% 0px -60% 0px" },
);
```

**Category pills:** Click handler scrolls to `document.getElementById(categoryId)` with `scrollIntoView({ behavior: "smooth" })`.

---

## 4. How Search Works

**File:** `src/routes/menu.tsx:47`

```typescript
const filtered = useMemo(() => {
  if (!query) return products;
  const q = query.toLowerCase();
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q),
  );
}, [query]);
```

- **Scope:** Searches `name` and `tagline` fields only
- **Matching:** Case-insensitive substring match (`.includes()`)
- **Performance:** In-memory filter on 8 items — instant
- **No debounce:** Filters on every keystroke (acceptable with 8 items)
- **No result count:** User doesn't see how many results matched
- **No empty state:** When no products match, categories with 0 items are hidden

**Home page search bar (non-functional):**
```typescript
// index.tsx:163-180
// SearchBar renders an <input> with no onChange handler
// The "Find" button has no onClick handler
// This is purely visual
```

---

## 5. How Filters Work

The only filter mechanism is the category scroll-spy, which visually highlights the active category but does not filter products. Actual product filtering is done via search only.

**Category-based filtering in menu.tsx:**
```typescript
// Each category section renders its products
{grouped.map((c) =>
  c.items.length === 0 ? null : (
    <section id={c.id} key={c.id}>
      <h2>{c.name}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {c.items.map((p) => <MenuCard key={p.id} product={p} />)}
      </div>
    </section>
  )
)}
```

---

## 6. How Modifiers Work

### Extras (with prices)

**State:** `extras: string[]` — array of selected extra IDs

**Toggle logic (menu.$slug.tsx:146-151):**
```typescript
onClick={() =>
  setExtras((prev) =>
    prev.includes(e.id)
      ? prev.filter((id) => id !== e.id)  // Remove
      : [...prev, e.id],                    // Add
  )
}
```

**Price calculation:**
```typescript
const extraTotal = EXTRAS.filter((e) => extras.includes(e.id))
  .reduce((s, e) => s + e.price, 0);
const total = (product.price + extraTotal) * qty;
```

### Modifiers (no extra cost)

**State:** `mods: string[]` — array of selected modifier strings

**Toggle logic (menu.$slug.tsx:180-183):**
```typescript
onClick={() =>
  setMods((prev) =>
    prev.includes(m)
      ? prev.filter((x) => x !== m)  // Remove
      : [...prev, m],                 // Add
  )
}
```

### How extras/modifiers are stored in cart

When "Add to bag" is clicked:
```typescript
add(product, { quantity: qty, extras: [...extras, ...mods], notes })
```

Both extras and modifier strings are merged into a single `extras` array on the `CartLine`. There is no distinction between priced extras and free modifiers in the cart — the extra cost is calculated at add time and baked into the line item.

**Display in cart (cart.tsx:86-89):**
```typescript
{l.extras && l.extras.length > 0 && (
  <p className="text-xs text-muted-foreground">
    {l.extras.join(" · ")}
  </p>
)}
```

---

## 7. How Variants Work

**There is no variant system.** Every product is single-variant. No size options, no flavor choices, no configurable base price.

The closest thing to variants is the extras/modifiers system on the product detail page, but these are add-ons, not product variants.

---

## 8. Pricing Calculations

### Per-Line Pricing

```
lineTotal = product.price × quantity
```

**Note:** Extra costs are NOT stored per-line. They are calculated at add-to-cart time and effectively baked into the product price for that line. However, the `CartLine` type does not store the extras-adjusted price — it stores `product.price` (the base price). This means:

**BUG:** If you add "The Ember Double" ($12.50) with "Extra cheese" ($1.50), the cart shows:
```
The Ember Double
Extra cheese · ...
Quantity: 1
$12.50    ← Should be $14.00
```

The extras are displayed but their cost is not reflected in the line total. The subtotal calculation in `CartContext` uses `l.product.price * l.quantity` which does not account for extras.

### Cart-Level Pricing (cart.tsx)

```
subtotal = Σ(line.product.price × line.quantity)   // Does NOT include extras
discount = applied === "EMBER20" ? subtotal × 0.2 : 0
deliveryFee = subtotal >= 25 || subtotal === 0 ? 0 : 3.99
total = max(0, subtotal - discount + deliveryFee)
```

### Checkout-Level Pricing (checkout.tsx)

```
fee = delivery === "pickup" || subtotal >= 25 ? 0 : 3.99
total = subtotal + fee
```

**Note:** Checkout does NOT apply the coupon discount. The coupon is only calculated in the cart page.

### Product Detail Page Pricing

```
extraTotal = Σ(selected extras' prices)
total = (product.price + extraTotal) × qty
```

This is the only place where extra costs are correctly calculated — but only for display on the "Add to bag" button. The actual cart storage ignores extras pricing.

---

## 9. Coupon System

**File:** `src/routes/cart.tsx:30`

```typescript
const discount = applied === "EMBER20" ? subtotal * 0.2 : 0;
```

**Rules:**
- Only one coupon: `EMBER20` (20% off)
- Case-insensitive (input is auto-uppercased)
- No minimum order
- No expiration
- No usage limits
- Applied once, not stackable
- Only affects cart page — not recalculated in checkout

**UI flow:**
1. User types coupon code in input (auto-uppercased)
2. Clicks "Apply"
3. `applied` state set to the input value
4. If `applied === "EMBER20"`: shows green message with discount amount
5. If not: shows red "Invalid coupon" message
6. Discount line appears in summary

---

## 10. Order Placement

**File:** `src/routes/checkout.tsx:307-309`

```typescript
onClick={() => {
  clear();        // Empties the cart (setLines([]))
  setPlaced(true); // Shows confirmation screen
}}
```

**What happens:**
1. Cart is emptied (in-memory only)
2. `placed` state flips to `true`
3. Confirmation screen shows: "Order placed!" + "Your order is firing up now... ready in ~25 minutes"
4. "Back to home" link

**What does NOT happen:**
- No API call
- No order saved anywhere
- No confirmation email
- No payment processed
- No order ID generated
- Cart data is permanently lost

---

## 11. Complete Data Flow Diagram

```
src/lib/menu-data.ts (static imports)
    │
    ├──→ index.tsx (products, categories, combos, offers)
    │       └──→ ProductCard, CategoryRail, Offers, CombosSection
    │
    ├──→ menu.tsx (products, categories)
    │       └──→ filtered → grouped → MenuCard
    │               └──→ useCart().add(product)
    │                       └──→ CartContext.lines (state)
    │
    ├──→ menu.$slug.tsx (products)
    │       └──→ product (from loader)
    │       └──→ extras, mods, notes, qty (local state)
    │       └──→ useCart().add(product, {qty, extras, notes})
    │               └──→ CartContext.lines (state)
    │
    ├──→ offers.tsx (offers)
    │       └──→ Offer cards
    │
    └──→ account.tsx (products)
            └──→ FavoritesTab (products.filter for favorites)

CartContext.lines
    │
    ├──→ Header.tsx → count (badge)
    │
    ├──→ cart.tsx → lines, subtotal, discount, deliveryFee, total
    │       └──→ coupon state (applied)
    │       └──→ Link to /checkout
    │
    └──→ checkout.tsx → lines, subtotal, fee, total
            └──→ address, delivery, time, payment (local state)
            └──→ clear() + setPlaced(true)
                    └──→ Confirmation screen

contact.tsx
    └──→ BRANCHES (hardcoded)
    └──→ active → branch → mapSrc → iframe
    └──→ sent → form state
```

---

## 12. Migration Guide: Replacing Fake Data with APIs

### Step 1: Product Data

**Current:** Static import from `menu-data.ts`
**Target:** REST API or CMS

```typescript
// Before (current)
import { products } from "@/lib/menu-data";

// After
import { useQuery } from "@tanstack/react-query";

function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then(r => r.json()),
  });
}
```

**Files to modify:** `menu.tsx`, `index.tsx`, `menu.$slug.tsx`, `account.tsx`

### Step 2: Cart Persistence

**Current:** `useState<CartLine[]>([])` in CartProvider
**Target:** localStorage + API sync

```typescript
// Before (current)
const [lines, setLines] = useState<CartLine[]>([]);

// After
const [lines, setLines] = useState<CartLine[]>(() => {
  try {
    const stored = localStorage.getItem("gb-cart");
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
});

useEffect(() => {
  localStorage.setItem("gb-cart", JSON.stringify(lines));
}, [lines]);
```

### Step 3: Checkout / Orders

**Current:** `clear() + setPlaced(true)`
**Target:** POST /api/orders

```typescript
const placeOrder = useMutation({
  mutationFn: (order) => fetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  }),
  onSuccess: () => { clear(); setPlaced(true); },
});
```

### Step 4: Authentication

**Current:** Hardcoded "Alex Jordan"
**Target:** Auth provider (Supabase Auth, Firebase Auth, custom)

Add auth context wrapping the app, protect `/account` and `/checkout` routes.

### Step 5: Contact Form

**Current:** `setSent(true)`
**Target:** POST /api/contact

```typescript
const submitContact = useMutation({
  mutationFn: (data) => fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  onSuccess: () => setSent(true),
});
```

### Step 6: Search

**Current:** In-memory filter on 8 items
**Target:** Backend search endpoint or Algolia/Meilisearch

```typescript
// For small catalogs: keep client-side
// For large catalogs: server-side search with debounce
const { data: results } = useQuery({
  queryKey: ["search", query],
  queryFn: () => fetch(`/api/search?q=${query}`).then(r => r.json()),
  enabled: query.length >= 2,
});
```

### Files Changed Per Migration Step

| Step | Files Modified | Files Added |
|------|---------------|-------------|
| Products | `menu.tsx`, `index.tsx`, `menu.$slug.tsx` | `hooks/use-products.ts` |
| Cart | `lib/cart.tsx` | — |
| Orders | `checkout.tsx`, `account.tsx` | `hooks/use-orders.ts` |
| Auth | `__root.tsx`, `account.tsx`, `checkout.tsx` | `lib/auth.tsx`, `hooks/use-auth.ts` |
| Contact | `contact.tsx` | `hooks/use-contact.ts` |
| Search | `menu.tsx` | `hooks/use-search.ts` |
