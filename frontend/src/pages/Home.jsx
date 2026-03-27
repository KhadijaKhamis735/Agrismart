import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CloudSun,
  Leaf,
  LineChart,
  LocateFixed,
  NotebookPen,
  Sparkles,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUI } from "../context/UIContext";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1592982537447-6f2a6a0f4f1d?auto=format&fit=crop&w=1800&q=80",
    titleKey: "homeSlide1Title",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1800&q=80",
    titleKey: "homeSlide2Title",
  },
  {
    image:
      "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1800&q=80",
    titleKey: "homeSlide3Title",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80",
    titleKey: "homeSlide4Title",
  },
];

const trustStats = [
  { value: "1000+", labelKey: "homeTrustPredictions" },
  { value: "250+", labelKey: "homeTrustFarmers" },
];

const aboutItems = [
  {
    icon: BrainIcon,
    titleKey: "homeAboutCard1Title",
    textKey: "homeAboutCard1Text",
  },
  {
    icon: TrendingUp,
    titleKey: "homeAboutCard2Title",
    textKey: "homeAboutCard2Text",
  },
  {
    icon: NotebookPen,
    titleKey: "homeAboutCard3Title",
    textKey: "homeAboutCard3Text",
  },
];

const featureCards = [
  {
    icon: LineChart,
    titleKey: "homeFeature1Title",
    textKey: "homeFeature1Text",
  },
  {
    icon: Sparkles,
    titleKey: "homeFeature2Title",
    textKey: "homeFeature2Text",
  },
  {
    icon: CloudSun,
    titleKey: "homeFeature3Title",
    textKey: "homeFeature3Text",
  },
  {
    icon: BadgeCheck,
    titleKey: "homeFeature4Title",
    textKey: "homeFeature4Text",
  },
];

const steps = [
  {
    icon: LocateFixed,
    titleKey: "homeStep1Title",
    textKey: "homeStep1Text",
  },
  {
    icon: BrainIcon,
    titleKey: "homeStep2Title",
    textKey: "homeStep2Text",
  },
  {
    icon: BarChart3,
    titleKey: "homeStep3Title",
    textKey: "homeStep3Text",
  },
];

const impactStats = [
  { value: "12,400+", labelKey: "homeImpactPredictions" },
  { value: "3,200+", labelKey: "homeImpactFarmers" },
  { value: "92%", labelKey: "homeImpactAccuracy" },
];

const benefits = [
  { icon: TrendingUp, titleKey: "homeBenefit1" },
  { icon: BrainIcon, titleKey: "homeBenefit2" },
  { icon: ShieldLeafIcon, titleKey: "homeBenefit3" },
  { icon: WalletLeafIcon, titleKey: "homeBenefit4" },
];

function BrainIcon(props) {
  return <Sprout {...props} />;
}

function ShieldLeafIcon(props) {
  return <Leaf {...props} />;
}

function WalletLeafIcon(props) {
  return <BadgeCheck {...props} />;
}

export default function Home() {
  const { language, setLanguage, t } = useUI();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-green-900 dark:text-green-100">
      <section
        className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.titleKey}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-900/65 to-green-700/55" />
        </div>

        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-8 sm:top-6">
          <select
            aria-label={t("navLanguage")}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-white/40 bg-white/10 px-2 py-2 text-xs font-semibold text-white backdrop-blur outline-none transition hover:bg-white/20 sm:text-sm"
          >
            <option value="en" className="text-green-700">🇬🇧 {t("langEnglish")}</option>
            <option value="sw" className="text-green-700">🇹🇿 {t("langSwahili")}</option>
            <option value="fr" className="text-green-700">🇫🇷 {t("langFrench")}</option>
          </select>
          <Link
            to="/login"
            className="rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            {t("loginTitle")}
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50"
          >
            {t("register")}
          </Link>
        </div>

        <div className="mx-auto flex min-h-[70vh] w-[92vw] max-w-screen-xl-custom items-center py-16 sm:py-24">
          <div className="z-10 max-w-2xl animate-fade-in-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur">
              <Sprout size={14} /> {t("homeTagline")}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              {t("homeHeroTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-base text-green-50 sm:text-lg">
              {t("homeHeroSubtitle")}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-green-800 transition hover:-translate-y-0.5 hover:bg-green-50"
              >
                {t("homeStartPrediction")} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {trustStats.map((item) => (
                <div key={item.labelKey} className="rounded-xl border border-white/30 bg-white/15 px-4 py-3 backdrop-blur">
                  <p className="text-xl font-extrabold text-white">{item.value}</p>
                  <p className="text-xs font-medium text-green-100">{t(item.labelKey)}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.titleKey}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-green-100">{t(heroSlides[activeSlide].titleKey)}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[92vw] max-w-screen-xl-custom py-14 sm:py-16">
        <h2 className="text-2xl font-extrabold text-green-800 dark:text-green-200">{t("homeAboutTitle")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {aboutItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.titleKey}
                className="animate-fade-in-up rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <Icon className="text-green-600" size={22} />
                <h3 className="mt-3 text-lg font-bold text-green-800 dark:text-green-200">{t(item.titleKey)}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t(item.textKey)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-gradient-to-b from-green-50 to-emerald-50 py-14 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto w-[92vw] max-w-screen-xl-custom">
          <h2 className="text-2xl font-extrabold text-green-800 dark:text-green-200">{t("homeFeaturesTitle")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.titleKey}
                  className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <Icon className="text-green-600" size={22} />
                  <h3 className="mt-3 text-lg font-bold text-green-800 dark:text-green-200">{t(feature.titleKey)}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t(feature.textKey)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[92vw] max-w-screen-xl-custom py-14 sm:py-16">
        <h2 className="text-2xl font-extrabold text-green-800 dark:text-green-200">{t("homeHowTitle")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.titleKey}
                className="relative rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="absolute right-4 top-4 text-xs font-bold text-green-500">0{index + 1}</span>
                <Icon className="text-green-600" size={22} />
                <h3 className="mt-3 text-lg font-bold text-green-800 dark:text-green-200">{t(step.titleKey)}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t(step.textKey)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-green-800 py-14 text-white">
        <div className="mx-auto w-[92vw] max-w-screen-xl-custom">
          <h2 className="text-2xl font-extrabold">{t("homeImpactTitle")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {impactStats.map((item) => (
              <article key={item.labelKey} className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-3xl font-extrabold">{item.value}</p>
                <p className="mt-1 text-sm text-green-100">{t(item.labelKey)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[92vw] max-w-screen-xl-custom py-14 sm:py-16">
        <h2 className="text-2xl font-extrabold text-green-800 dark:text-green-200">{t("homeBenefitsTitle")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.titleKey}
                className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <Icon className="text-green-600" size={22} />
                <p className="mt-3 text-base font-bold text-green-800 dark:text-green-200">{t(benefit.titleKey)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-gradient-to-r from-green-700 to-emerald-700 py-16 text-white">
        <div className="mx-auto w-[92vw] max-w-screen-xl-custom text-center">
          <h2 className="text-3xl font-extrabold">{t("homeCtaTitle")}</h2>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-green-800 transition hover:-translate-y-0.5 hover:bg-green-50"
          >
            {t("homeGetStarted")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex w-[92vw] max-w-screen-xl-custom flex-col items-center justify-between gap-4 py-8 text-sm text-gray-600 dark:text-gray-300 sm:flex-row">
        <p>© {new Date().getFullYear()} Kilimo Logic</p>
        <div className="flex items-center gap-4">
          <a href="#" className="transition hover:text-green-700 dark:hover:text-green-300">{t("homeFooterAbout")}</a>
          <a href="#" className="transition hover:text-green-700 dark:hover:text-green-300">{t("homeFooterContact")}</a>
        </div>
      </footer>
    </div>
  );
}
