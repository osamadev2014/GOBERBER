import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src="/footer-logo.svg" alt="Go Burger" className="h-10 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {t("footerDesc")}
          </p>
          <div className="mt-6 flex gap-2">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title={t("footerOrder")}
          links={[
            [t("footerMenu"), "/menu"],
            [t("footerOffers"), "/offers"],
            [t("footerCombos"), "/menu"],
          ]}
        />
        <FooterCol
          title={t("footerCompany")}
          links={[
            [t("footerAbout"), "/about"],
            [t("footerContact"), "/contact"],
          ]}
        />
        <FooterCol
          title={t("footerSupport")}
          links={[
            [t("footerContact"), "/contact"],
            [t("footerLocations"), "/contact"],
          ]}
        />
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Go Burger. All rights reserved.</p>
          <p className="flex gap-4">
            <span className="hover:text-foreground cursor-default">{t("footerPrivacy")}</span>
            <span className="hover:text-foreground cursor-default">{t("footerTerms")}</span>
            <span className="hover:text-foreground cursor-default">{t("footerAllergens")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<[string, string]>;
}) {
  return (
    <div>
      <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-primary">
        {title}
      </h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to as "/menu" | "/offers" | "/about" | "/contact"} className="transition-colors hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
