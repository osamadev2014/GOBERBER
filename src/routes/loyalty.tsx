import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, ShoppingBag, Gift } from "lucide-react";
import { useT } from "@/lib/i18n";
import heroBurger from "@/assets/hero-burger.jpg";
import burgerClassic from "@/assets/burger-classic.jpg";
import catShakes from "@/assets/cat-shakes.jpg";

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

function LoyaltyPage() {
  const { t } = useT();

  const steps = [
    {
      icon: Smartphone,
      title: t("loyaltyStep1"),
      desc: t("loyaltyStep1Desc"),
    },
    {
      icon: ShoppingBag,
      title: t("loyaltyStep2"),
      desc: t("loyaltyStep2Desc"),
    },
    {
      icon: Gift,
      title: t("loyaltyStep3"),
      desc: t("loyaltyStep3Desc"),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">{t("loyaltyEyebrow")}</p>
        <h1 className="mt-3 font-display text-6xl leading-none sm:text-7xl">{t("loyaltyTitle")}</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">{t("loyaltyDesc")}</p>
      </header>

      <div className="mt-12 overflow-hidden rounded-[2rem] border border-border/60">
        <img
          src={heroBurger}
          alt="Go Burger signature smash burger"
          className="h-[320px] w-full object-cover sm:h-[420px]"
        />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-card"
          >
            <div className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-border/60">
          <img
            src={burgerClassic}
            alt="Classic cheeseburger"
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 start-0 p-6">
            <p className="font-display text-2xl text-white">{t("loyaltyStep3")}</p>
            <p className="mt-1 text-sm text-white/80">{t("loyaltyStep3Desc")}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/60">
          <img src={catShakes} alt="Free milkshake" className="h-48 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 start-0 p-6">
            <p className="font-display text-2xl text-white">+ مشروب مجاني</p>
            <p className="mt-1 text-sm text-white/80">
              مع كل وجبة مجانية تحصل على مشروب من اختيارك
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-8 text-center">
          <h2 className="font-display text-2xl">{t("loyaltyScanTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("loyaltyScanDesc")}</p>

          <div className="mt-6 flex justify-center">
            <div className="rounded-2xl bg-white p-4">
              <QRCodeSVG
                value={LOYALTY_URL}
                size={200}
                bgColor="#ffffff"
                fgColor="#1a0f08"
                level="M"
                includeMargin={false}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <img
              src="/google-apple-wallet.svg"
              alt="Google Wallet & Apple Wallet"
              className="h-12 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
