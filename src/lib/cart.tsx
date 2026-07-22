import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./menu-data";

export type CartExtra = { id: string; label: string; price: number };

export type CartLine = {
  id: string;
  product: Product;
  quantity: number;
  notes?: string;
  extras?: CartExtra[];
  mods?: string[];
};

export type CouponCode = "EMBER20" | null;

const COUPON_DISCOUNT: Record<string, number> = {
  EMBER20: 0.2,
};

type CartContextValue = {
  lines: CartLine[];
  add: (product: Product, opts?: { quantity?: number; extras?: CartExtra[]; mods?: string[]; notes?: string }) => void;
  updateQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  extrasTotal: number;
  coupon: CouponCode;
  setCoupon: (c: CouponCode) => void;
  discount: number;
  deliveryFee: number;
  total: number;
};

const FREE_DELIVERY_THRESHOLD = 25;
const BASE_DELIVERY_FEE = 3.99;

const CartContext = createContext<CartContextValue | null>(null);

function lineExtrasTotal(line: CartLine): number {
  if (!line.extras?.length) return 0;
  return line.extras.reduce((s, e) => s + e.price, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<CouponCode>(null);

  const add: CartContextValue["add"] = useCallback((product, opts = {}) => {
    const qty = opts.quantity ?? 1;
    setLines((prev) => {
      const existing = prev.find(
        (l) =>
          l.product.id === product.id &&
          !l.extras?.length &&
          !l.mods?.length &&
          !l.notes,
      );
      if (existing && !opts.extras?.length && !opts.mods?.length && !opts.notes) {
        return prev.map((l) =>
          l.id === existing.id ? { ...l, quantity: l.quantity + qty } : l,
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          product,
          quantity: qty,
          extras: opts.extras,
          mods: opts.mods,
          notes: opts.notes,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((lineId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== lineId)
        : prev.map((l) => (l.id === lineId ? { ...l, quantity: qty } : l)),
    );
  }, []);

  const remove = useCallback(
    (lineId: string) => setLines((prev) => prev.filter((l) => l.id !== lineId)),
    [],
  );

  const clear = useCallback(() => {
    setLines([]);
    setCoupon(null);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce(
      (s, l) => s + l.product.price * l.quantity,
      0,
    );
    const extrasTotal = lines.reduce(
      (s, l) => s + lineExtrasTotal(l) * l.quantity,
      0,
    );
    const discountRate = coupon ? (COUPON_DISCOUNT[coupon] ?? 0) : 0;
    const discount = subtotal * discountRate;
    const deliveryFee =
      subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : BASE_DELIVERY_FEE;
    const total = Math.max(0, subtotal + extrasTotal - discount + deliveryFee);

    return {
      lines,
      add,
      updateQty,
      remove,
      clear,
      count,
      subtotal,
      extrasTotal,
      coupon,
      setCoupon,
      discount,
      deliveryFee,
      total,
    };
  }, [lines, add, updateQty, remove, clear, coupon]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    return {
      lines: [] as CartLine[],
      add: () => {},
      updateQty: () => {},
      remove: () => {},
      clear: () => {},
      count: 0,
      subtotal: 0,
      extrasTotal: 0,
      coupon: null as CouponCode,
      setCoupon: () => {},
      discount: 0,
      deliveryFee: 0,
      total: 0,
    };
  }
  return ctx;
}
