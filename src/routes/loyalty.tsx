import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { useT } from "@/lib/i18n";
import heroBurger from "@/assets/hero-burger.jpg";

export const Route = createFileRoute("/loyalty")({
  head: () => ({
    meta: [
      { title: "بطاقة الولاء — Go Burger" },
      {
        name: "description",
        content:
          "اطلب 6 وجبات واحصل على الوجبة السابعة مجاناً مع مشروب مجاني. سجّل الآن في بطاقة الولاء.",
      },
      { property: "og:title", content: "بطاقة الولاء — Go Burger" },
      {
        property: "og:description",
        content: "اطلب 6 وجبات واحصل على الوجبة السابعة مجاناً مع مشروب مجاني.",
      },
    ],
  }),
  component: LoyaltyPage,
});

const LOYALTY_URL = "https://example.com/loyalty";

function Stamp({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-10 w-10 sm:h-12 sm:w-12 ${filled ? "text-primary" : "text-border"}`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="2.5"
        fill={filled ? "currentColor" : "none"}
        opacity={filled ? 0.15 : 1}
      />
      {filled ? (
        <path
          d="M15 24.5L21 30.5L33 18.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <text
          x="24"
          y="29"
          textAnchor="middle"
          fill="currentColor"
          fontSize="14"
          fontWeight="600"
          opacity="0.4"
        >
          ★
        </text>
      )}
    </svg>
  );
}

function LoyaltyPage() {
  const { t } = useT();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/60">
        <img
          src={heroBurger}
          alt="Go Burger signature smash burger"
          className="h-[360px] w-full object-cover sm:h-[440px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">{t("loyaltyEyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-white sm:text-7xl">
            {t("loyaltyTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/80 sm:text-lg">
            {t("loyaltyDesc")}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-md">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
          <div className="flex items-center justify-center border-b border-border/60 bg-primary/5 px-6 py-5">
            <img src="/logo.svg" alt="Go Burger" className="h-10 w-auto" />
          </div>

          <div className="px-6 py-8 sm:px-8">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("loyaltyEyebrow")}
            </p>
            <h2 className="mt-2 text-center font-display text-2xl">{t("loyaltyTitle")}</h2>

            <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Stamp key={i} filled={i === 0} />
              ))}
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground">1 / 6</p>
          </div>

          <div className="border-t border-border/60 bg-background/50 px-6 py-8 sm:px-8">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-white p-3">
                <QRCodeSVG
                  value={LOYALTY_URL}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#1a0f08"
                  level="M"
                  includeMargin={false}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <img
                src="/google-apple-wallet.svg"
                alt="Google Wallet & Apple Wallet"
                className="h-11 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
