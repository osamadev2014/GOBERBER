import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { useT } from "@/lib/i18n";

export function Header() {
  const { count } = useCart();
  const { t } = useT();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    { to: "/menu", label: t("navMenu") },
    { to: "/offers", label: t("navOffers") },
    { to: "/loyalty", label: t("navLoyalty") },
    { to: "/about", label: t("navAbout") },
    { to: "/contact", label: t("navContact") },
  ] as const;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/menu", search: { q: searchQuery.trim() } });
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Logo />

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label={t("navMenu")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              to="/cart"
              data-tour-id="cart"
              className="relative flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">{t("navCart")}</span>
              <span className="rounded-full bg-primary-foreground/15 px-1.5 text-xs">{count}</span>
            </Link>
            <Link
              to="/account"
              aria-label={t("navAccount")}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-[70] w-72 bg-background border-r border-border/60 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <Logo compact />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-4 py-6">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-border/60 px-4 py-4 space-y-2">
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <ShoppingBag className="h-4 w-4" />
                {t("navCart")} ({count})
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <User className="h-4 w-4" />
                {t("navAccount")}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
