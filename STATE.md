# STATE.md — Go Burger Premium

> Complete map of all state management in the Go Burger application.
> Covers every Context, Provider, Hook, and local state variable.

---

## 1. State Architecture Overview

| State Type | Count | Location |
|------------|-------|----------|
| React Context (global) | 1 | `CartContext` in `src/lib/cart.tsx` |
| Route-level `useState` | 19 | Spread across 6 route files |
| Derived/computed values | 12 | `useMemo` or inline computations |
| `useEffect` calls | 2 | `menu.tsx` (IntersectionObserver), `use-mobile.tsx` (media query) |
| Server state | 0 | No API calls, no `useQuery` |
| Persistent state | 0 | No localStorage, no cookies |
| URL state | 0 | No search params |

**Total state variables: 21** (1 context + 19 useState + 1 useEffect-driven)

---

## 2. CartContext — The Only Global State

**File:** `src/lib/cart.tsx:1`

### Type Definitions

```typescript
// Exported — used by all consumers
type CartLine = {
  id: string;          // "${product.id}-${Date.now()}-${random4chars}"
  product: Product;    // Full product object
  quantity: number;
  notes?: string;      // Special instructions
  extras?: string[];   // Selected extras/modifiers
};

// Internal — context value shape
type CartContextValue = {
  lines: CartLine[];
  add: (product: Product, opts?: {
    quantity?: number;
    extras?: string[];
    notes?: string;
  }) => void;
  updateQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  count: number;       // Total items across all lines
  subtotal: number;    // Sum of (price × quantity)
};
```

### Provider Implementation

**File:** `src/lib/cart.tsx:30` — `CartProvider`

**Internal state:**
```typescript
const [lines, setLines] = useState<CartLine[]>([]);
```

**Methods (all `useCallback` with `[]` deps):**

#### `add(product, opts?)` — Lines 33-52

```
1. Extract qty from opts.quantity, default to 1
2. Search previous lines for existing line where:
   - l.product.id === product.id
   - AND l.extras is empty/undefined
   - AND l.notes is falsy
3. If match found AND new call has no extras AND no notes:
   → Increment matching line's quantity (immutable update)
4. Otherwise (new line or line with extras/notes):
   → Append new CartLine with unique ID
```

#### `updateQty(lineId, qty)` — Lines 54-63

```
1. If qty <= 0: filter out the line (removes it)
2. Otherwise: map lines, replace matching line's quantity
```

#### `remove(lineId)` — Lines 65-67

```
Filter out the line with matching lineId
```

#### `clear()` — Lines 69-71

```
setLines([])
```

### Derived Values (useMemo)

```typescript
const value = useMemo(() => ({
  lines,
  add, updateQty, remove, clear,
  count: lines.reduce((n, l) => n + l.quantity, 0),
  subtotal: lines.reduce((s, l) => s + l.product.price * l.quantity, 0),
}), [lines, add, updateQty, remove, clear]);
```

### Consumer Hook — `useCart()`

**File:** `src/lib/cart.tsx:77`

```
1. Call useContext(CartContext)
2. If null (outside provider/SSR): return no-op fallback
   { lines: [], add: () => {}, updateQty: () => {}, remove: () => {},
     clear: () => {}, count: 0, subtotal: 0 }
3. Otherwise: return actual context value
```

### Where CartContext Is Consumed

| File | Line | Values | Purpose |
|------|------|--------|---------|
| `Header.tsx` | 14 | `count` | Cart badge count |
| `menu.tsx` | 132 | `add, lines, updateQty` | Add items, quantity stepper |
| `menu.$slug.tsx` | 41 | `add` | Add with extras/modifiers/notes |
| `cart.tsx` | 25 | `lines, updateQty, remove, subtotal` | Cart display, edit, totals |
| `checkout.tsx` | 38 | `lines, subtotal, clear` | Order summary, clear on placement |

---

## 3. Route-Level Local State

### `menu.tsx` — 2 state variables

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `active` | `string` | `"signatures"` | Visible category (IntersectionObserver-synced) |
| `query` | `string` | `""` | Search input text |

**Effect:** `IntersectionObserver` (line 32-45) watches `<section>` elements by ID, updates `active`. Root margin: `-30% 0px -60% 0px`. Cleanup: `observer.disconnect()`.

### `menu.$slug.tsx` — 4 state variables

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `qty` | `number` | `1` | Quantity to add |
| `extras` | `string[]` | `[]` | Selected extra IDs |
| `mods` | `string[]` | `[]` | Selected modifier strings |
| `notes` | `string` | `""` | Special instructions |

### `cart.tsx` — 3 state variables

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `coupon` | `string` | `""` | Coupon input (auto-uppercased) |
| `applied` | `string \| null` | `null` | Applied coupon code |
| `notes` | `string` | `""` | Order notes |

### `checkout.tsx` — 6 state variables

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `step` | `number` | `0` | Current step (0=Address, 1=Delivery, 2=Payment, 3=Review) |
| `address` | `string` | `"home"` | Selected address |
| `delivery` | `"delivery" \| "pickup"` | `"delivery"` | Delivery mode |
| `time` | `string` | `"asap"` | Timing |
| `payment` | `string` | `"card"` | Payment method |
| `placed` | `boolean` | `false` | Confirmation state |

### `account.tsx` — 1 state variable

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `tab` | `"orders" \| "favorites" \| "addresses" \| "profile" \| "rewards"` | `"orders"` | Active tab |

### `contact.tsx` — 2 state variables

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| `active` | `string` | `"downtown"` | Selected branch |
| `sent` | `boolean` | `false` | Form submitted |

### Pages with zero state: `index.tsx`, `about.tsx`, `offers.tsx`, `__root.tsx`

---

## 4. Derived State

### In `menu.tsx`

```typescript
// Filter products by search query (line 47)
const filtered = useMemo(() => {
  if (!query) return products;
  const q = query.toLowerCase();
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q),
  );
}, [query]);

// Group filtered products by category (line 57)
const grouped = useMemo(
  () => categories.map((c) => ({ ...c, items: filtered.filter((p) => p.category === c.id) })),
  [filtered],
);
```

### In `menu.$slug.tsx`

```typescript
const extraTotal = EXTRAS.filter((e) => extras.includes(e.id)).reduce((s, e) => s + e.price, 0);
const total = (product.price + extraTotal) * qty;
const recommendations = products.filter((p) => p.id !== product.id).slice(0, 4);
```

### In `cart.tsx`

```typescript
const discount = applied === "EMBER20" ? subtotal * 0.2 : 0;
const deliveryFee = subtotal >= 25 || subtotal === 0 ? 0 : 3.99;
const total = Math.max(0, subtotal - discount + deliveryFee);
```

### In `checkout.tsx`

```typescript
const fee = delivery === "pickup" || subtotal >= 25 ? 0 : 3.99;
const total = subtotal + fee;
```

### In `index.tsx`

```typescript
const signatures = products.filter((p) => p.category === "signatures");
const popular = products.slice(0, 4);
```

### In `menu.tsx` (MenuCard)

```typescript
const line = lines.find((l) => l.product.id === product.id);
const qty = line?.quantity ?? 0;
```

---

## 5. Context Provider Hierarchy

```
Router (TanStack Router — provides queryClient in context)
└── QueryClientProvider (@tanstack/react-query)
    └── CartProvider (src/lib/cart.tsx)
        └── div.flex.min-h-screen
            ├── Header (reads useCart for count)
            ├── main
            │   └── <Outlet /> (child routes)
            └── Footer
```

| Provider | File | Purpose | Consumers |
|----------|------|---------|-----------|
| `QueryClientProvider` | `__root.tsx:144` | TanStack Query (unused) | None |
| `CartProvider` | `__root.tsx:145` | Cart state | Header, menu, menu.$slug, cart, checkout |

---

## 6. State Flow Diagrams

### Add to Cart

```
User clicks "Add" on menu
  → MenuCard.add(product)           [menu.tsx:168]
    → CartContext.add(product)      [cart.tsx:33]
      → searches lines for matching product.id
      → if match (no extras/notes): increment quantity
      → else: append new CartLine
      → setLines(updater)
        → React re-renders CartProvider
          → useMemo recomputes count, subtotal
            → Header re-renders (new count)
            → MenuCard re-renders (updated qty)
```

### Product Detail → Cart

```
User selects extras/modifiers
  → useState: extras, mods updated  [menu.$slug.tsx:146-183]
  → Derived: extraTotal, total recalculated
  → UI: "Add to bag . $total" shows new price

User clicks "Add to bag"
  → CartContext.add(product, { qty, extras: [...extras, ...mods], notes })
    → extras/notes present → always creates NEW line (no merge)
    → setLines appends new CartLine
```

### Checkout Flow

```
User navigates to /checkout
  → CheckoutPage mounts (6 useState)
  → Reads: lines, subtotal, clear from CartContext
  → Displays order summary from lines

User progresses steps
  → step++ (useState)
  → Different Panel/Choice render based on step
  → address, delivery, time, payment updated by Choice onClick

User clicks "Place order"
  → clear() empties cart  [checkout.tsx:308]
  → setPlaced(true) → confirmation screen
  → No API call, no persistence
```

### Search Flow

```
User types in /menu search
  → onChange: setQuery(e.target.value)  [menu.tsx:85]
  → useMemo: filtered = products matching query
  → useMemo: grouped = categories with filtered items
  → React re-renders with filtered grid
  → Empty categories hidden (length === 0 → null)
```

---

## 7. Missing State Management

### No Persistence

| Missing | Impact | Solution |
|---------|--------|----------|
| Cart | Lost on refresh | `localStorage` in CartProvider |
| Coupon | Lost on refresh | `localStorage` or URL params |
| Checkout progress | Lost on refresh | `sessionStorage` |
| User prefs | Nothing remembered | `localStorage` |

### No URL State

| Missing | Impact | Solution |
|---------|--------|----------|
| Search query | Can't share results | `useSearchParams` |
| Active category | Can't deep-link | URL hash or params |
| Checkout step | Can't link to step | Search params |
| Account tab | Can't deep-link | Search params |

### No Server State

| Missing | Impact | Solution |
|---------|--------|----------|
| Products | All hardcoded | `useQuery` |
| Orders | Mock data | `useQuery` + `useMutation` |
| Profile | Mock data | `useQuery` |
| Contact form | No submission | `useMutation` |

---

## 8. State Anti-Patterns

### 8.1 Cart Line ID Generation (`cart.tsx:46`)
```typescript
id: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
```
- `Date.now()` millisecond resolution — rapid adds could collide
- 4 random chars — low entropy
- Better: `crypto.randomUUID()`

### 8.2 Extras/Notes Merge Logic (`cart.tsx:37-39`)
- Only merges when BOTH new and existing have NO extras/notes
- Adding same burger with no extras to a line that HAS extras creates NEW line
- No way to "upgrade" existing line's extras

### 8.3 Coupon Validation Inline (`cart.tsx:30`)
```typescript
const discount = applied === "EMBER20" ? subtotal * 0.2 : 0;
```
- Only one hardcoded coupon
- No expiration, limits, minimum order
- Should be a `coupons.ts` module

### 8.4 Delivery Fee Duplicated
```typescript
// cart.tsx:31 — doesn't account for pickup
const deliveryFee = subtotal >= 25 || subtotal === 0 ? 0 : 3.99;

// checkout.tsx:46 — accounts for pickup
const fee = delivery === "pickup" || subtotal >= 25 ? 0 : 3.99;
```
Different logic in two places. Should be a shared utility.

### 8.5 No React.memo
- `ProductCard`, `MenuCard`, `SectionHeader` all re-render on every parent render
- None wrapped in `React.memo`

### 8.6 useCallback with `[]` deps (`cart.tsx:33-71`)
- Correct for this use case (only calls `setLines`)
- Could mislead future maintainers
