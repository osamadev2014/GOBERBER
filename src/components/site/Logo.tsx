import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2">
      {!compact && (
        <img
          src="/logo.svg"
          alt="Go Burger"
          className="h-10 w-auto"
        />
      )}
    </Link>
  );
}
