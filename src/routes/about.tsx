import { createFileRoute } from "@tanstack/react-router";
import { Flame, Users, MapPin } from "lucide-react";
import heroBurger from "@/assets/hero-burger.jpg";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Go Burger" },
      {
        name: "description",
        content: "How we craft fire-seared smash burgers, from source to sear.",
      },
      { property: "og:title", content: "About — Go Burger" },
      {
        property: "og:description",
        content: "How we craft fire-seared smash burgers, from source to sear.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useT();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">
        {t("aboutEyebrow")}
      </p>
      <h1 className="mt-3 font-display text-6xl leading-none sm:text-7xl">
        {t("aboutTitle1")}<br />{t("aboutTitle2")}<br /><span className="text-primary">{t("aboutTitle3")}</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        {t("aboutDesc")}
      </p>

      <div className="mt-12 overflow-hidden rounded-[2rem] border border-border/60">
        <img
          src={heroBurger}
          alt="A Go Burger signature double smash burger"
          className="h-[420px] w-full object-cover"
        />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { Icon: Flame, title: t("aboutSear"), body: t("aboutSearBody") },
          { Icon: Users, title: t("aboutCrew"), body: t("aboutCrewBody") },
          { Icon: MapPin, title: t("aboutLocations"), body: t("aboutLocationsBody") },
        ].map((v) => (
          <div
            key={v.title}
            className="rounded-3xl border border-border/60 bg-card p-6"
          >
            <v.Icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-xl">{v.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
