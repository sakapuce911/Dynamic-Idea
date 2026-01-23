"use client";

// File: dynamic-idea/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import AvisClients from "@/src/components/AvisClients";
import { supabase } from "@/src/lib/supabaseClient";

const WHATSAPP_NUMBER = "23057261909";
const EMAIL = "dynamicbusiness.idea@gmail.com";

const WHATSAPP_LINK =
  "https://wa.me/" +
  WHATSAPP_NUMBER +
  "?text=" +
  encodeURIComponent(
    "Bonjour Dynamic Idea ! Je suis à Madagascar/Mauritius. Mon profil : (Individuel / PME / B2B). Mon objectif : ... Mon secteur : ... Mon budget : ..."
  );

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

type AvisClient = {
  id: string;
  nom: string;
  avis: string;
  note: number | null;
  actif: boolean;
  created_at: string;
};

function SoftReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.55, ease: "easeOut", delay }
      }
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const reduce = useReducedMotion();

  // Parallax léger (swello vibe)
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const blobOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [0.9, reduce ? 0.9 : 0.55]
  );

  // ✅ Tabs Solutions
  type SegmentKey = "individuels" | "pme" | "b2b";
  const [segment, setSegment] = useState<SegmentKey>("pme");

  const segmentData = useMemo(
    () => ({
      individuels: {
        badge: "INDIVIDUELS",
        subtitle: "Solopreneurs • Coachs • Freelances • Consultants",
        title: "Personal Branding + Stratégie de contenu",
        pitch:
          "Vous êtes la marque. L’objectif : inspirer confiance et devenir visible (sans payer des pubs).",
        bullets: [
          "Ghostwriting LinkedIn (on écrit à votre place, avec votre ton)",
          "Coaching “quoi poster et quand ?” (planning simple & réaliste)",
          "Montage Reels/TikToks (format court, expertise, crédibilité)",
        ],
        result:
          "Résultat : visibilité organique + demandes (DM / WhatsApp / RDV).",
        cta: "Je veux développer ma marque",
      },
      pme: {
        badge: "PME",
        subtitle:
          "E-commerce • Magasins • Restaurants • Artisans • Cliniques",
        title: "Ads + Création créative (UGC) qui vend",
        pitch:
          "Les pubs ne marchent pas quand le visuel est mauvais. On fait le duo gagnant : créa + campagne.",
        bullets: [
          "Gestion Meta Ads (Facebook/Instagram) ou Google Ads",
          "Production de créas : photos produits, vidéos témoignages, UGC",
          "Tracking & mesure (Pixel / événements) pour prouver le ROI",
        ],
        result: "Résultat : campagnes plus rentables + clients plus vite.",
        cta: "Je veux des clients rapidement",
        highlight: true,
      },
      b2b: {
        badge: "B2B",
        subtitle: "SaaS • Industries • Grossistes • Agences de services",
        title: "Prospection qualifiée : Email + LinkedIn",
        pitch:
          "Objectif : obtenir des rendez-vous qualifiés. Ciblage précis + messages personnalisés (pas du spam).",
        bullets: [
          "Ciblage & recherche de décideurs (ICP clair, secteurs, rôles)",
          "Copywriting de séquences (emails & LinkedIn) orientées RDV",
          "Mise en place d’un système conforme (qualité + opt-out)",
        ],
        result: "Résultat : pipeline de leads + RDV dans l’agenda.",
        cta: "Je veux des RDV qualifiés",
      },
    }),
    []
  );

  const current = segmentData[segment];

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-9 w-9">
              <Image
                src="/logo.png"
                alt="Dynamic Idea"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-sm font-semibold tracking-wide">
              Dynamic Idea
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#offres" className="text-sm hover:text-red-600">
              Offres
            </a>
            <a href="#prix" className="text-sm hover:text-red-600">
              Prix
            </a>
            <a href="#solutions" className="text-sm hover:text-red-600">
              Solutions
            </a>
            <a href="#process" className="text-sm hover:text-red-600">
              Process
            </a>
            <a href="#avis" className="text-sm hover:text-red-600">
              Avis clients
            </a>
            <Link
              href="/contact"
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Nous contacter
            </Link>
          </nav>

          <Link
            href="/contact"
            className="md:hidden rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Contact
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef as any} className="relative overflow-hidden">
        {/* blobs derrière */}
        <motion.div
          style={{ y: blobY, opacity: blobOpacity }}
          className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-red-100 blur-3xl"
        />
        <motion.div
          style={{ y: blobY, opacity: blobOpacity }}
          className="pointer-events-none absolute -bottom-44 right-[-140px] -z-10 h-[540px] w-[540px] rounded-full bg-neutral-100 blur-3xl"
        />

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          {/* LEFT */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative z-10"
          >
            <motion.p
              variants={fadeUp}
              transition={
                reduce ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }
              }
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700"
            >
              Agence marketing
              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-600" />
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={
                reduce ? { duration: 0 } : { duration: 0.65, ease: "easeOut" }
              }
              className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl"
            >
              Boostez votre <span className="text-red-600">branding</span>
              <br />
              et votre contenu <br />
              avec des <span className="text-red-600">outils Pro</span> + une
              stratégie simple.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={
                reduce ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }
              }
              className="mt-4 text-base leading-relaxed text-neutral-700"
            >
              Dynamic Idea vous aide à produire plus vite, mieux vendre et être
              plus visible grâce à <strong>Canva Pro</strong>,{" "}
              <strong>LinkedIn Learning</strong>, <strong>Figma Pro</strong> et
              un accompagnement marketing orienté résultats.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={
                reduce ? { duration: 0 } : { duration: 0.75, ease: "easeOut" }
              }
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#solutions"
                className="rounded-full bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-red-700"
              >
                Voir les solutions
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-neutral-300 px-6 py-3 text-center text-sm font-semibold hover:border-neutral-400"
              >
                WhatsApp (devis rapide)
              </a>
            </motion.div>

            <motion.p
              variants={fadeUp}
              transition={
                reduce ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }
              }
              className="mt-6 text-sm text-neutral-600"
            >
              Email :{" "}
              <a
                className="font-semibold hover:text-red-600"
                href={`mailto:${EMAIL}`}
              >
                {EMAIL}
              </a>
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={
                reduce ? { duration: 0 } : { duration: 0.85, ease: "easeOut" }
              }
              className="mt-8 grid grid-cols-3 gap-4 text-sm"
            >
              <InfoCard label="Nos équipes" value="MDG & MU" />
              <InfoCard label="Support" value="WhatsApp + Email" />
              <InfoCard label="Objectif" value="Visibilité & Conversion" />
            </motion.div>
          </motion.div>

          {/* RIGHT */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.65, ease: "easeOut", delay: 0.1 }
              }
              className="relative rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              {/* ÉTAGE 1 — Résumé visuel */}
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">Ce que vous obtenez</h2>
                <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                  Simple • Pro • Rapide
                </span>
              </div>

              <p className="mt-1 text-sm text-neutral-700">
                Un plan clair + une exécution concrète (sans blabla).
              </p>

              {/* Mockup */}
              <div className="relative mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs font-semibold text-neutral-600">
                    Plan marketing express
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs font-semibold text-neutral-500">
                      Positionnement
                    </p>
                    <p className="mt-1 text-sm font-bold">Offre plus claire</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs font-semibold text-neutral-500">
                      Contenu
                    </p>
                    <p className="mt-1 text-sm font-bold">Rythme régulier</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs font-semibold text-neutral-500">
                      Conversion
                    </p>
                    <p className="mt-1 text-sm font-bold">Clients qualifiés</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs font-semibold text-neutral-500">
                      Image
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      Crédibilité immédiate
                    </p>
                  </div>
                </div>

                <FloatingBadge
                  className="absolute -top-3 right-6"
                  label="Canva Pro"
                />
                <FloatingBadge
                  className="absolute top-14 -right-4"
                  label="LinkedIn"
                />
                <FloatingBadge
                  className="absolute bottom-10 -left-5"
                  label="Figma"
                />
                <FloatingBadge
                  className="absolute -bottom-4 left-10"
                  label="Marketing"
                />
              </div>

              {/* ÉTAGE 2 — Preuve sociale */}
              <div className="mt-6 space-y-3">
                <ProofSocialCard />
                <ProSuiteCard />
                <TriggerCard />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Offres */}
      <section id="offres" className="border-t border-neutral-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <SoftReveal>
            <h2 className="text-3xl font-extrabold">Offres Pro</h2>
            <p className="mt-2 max-w-2xl text-neutral-700">
              Outils premium + option accompagnement marketing. Packs sur mesure
              : sur devis.
            </p>
          </SoftReveal>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <SoftReveal delay={0.05}>
              <OfferCard
                title="Canva Pro"
                tag="Contenu & Branding"
                points={[
                  "Visuels premium (posts, flyers, stories)",
                  "Brand Kit + exports HD",
                  "Idéal pour booster ta présence",
                ]}
              />
            </SoftReveal>

            <SoftReveal delay={0.1}>
              <OfferCard
                title="LinkedIn Learning"
                tag="Formation & Compétences"
                points={[
                  "Marketing / business / productivité",
                  "Apprendre vite et appliquer",
                  "Idéal pour équipes & indépendants",
                ]}
              />
            </SoftReveal>

            <SoftReveal delay={0.15}>
              <OfferCard
                title="Figma Pro"
                tag="UI/UX & Prototypage"
                points={[
                  "Maquettes pro pour sites & apps",
                  "Prototypes clairs + collaboration",
                  "Design sérieux et cohérent",
                ]}
              />
            </SoftReveal>
          </div>
        </div>
      </section>

      {/* Prix */}
      <section id="prix" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <SoftReveal>
            <h2 className="text-3xl font-extrabold">Prix (outil unitaire)</h2>
            <p className="mt-2 max-w-2xl text-neutral-700">
              Les solutions marketing personnalisées sont{" "}
              <strong>sur devis</strong>.
            </p>
          </SoftReveal>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <SoftReveal delay={0.05}>
              <PriceCard
                name="Canva Pro"
                ariary="60 000 Ar"
                rupees="Rs 600"
                note="Contenu rapide & propre."
              />
            </SoftReveal>
            <SoftReveal delay={0.1}>
              <PriceCard
                name="LinkedIn Learning"
                ariary="70 000 Ar"
                rupees="Rs 700"
                note="Apprendre et progresser."
              />
            </SoftReveal>
            <SoftReveal delay={0.15}>
              <PriceCard
                name="Figma Pro"
                ariary="70 000 Ar"
                rupees="Rs 700"
                note="UI/UX pro & collaboration."
              />
            </SoftReveal>
          </div>

          <SoftReveal delay={0.05}>
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-white p-6 md:flex-row md:items-center">
              <div>
                <p className="text-lg font-bold">Commander en 1 minute</p>
                <p className="mt-1 text-sm text-neutral-700">
                  WhatsApp : l'offre + ton objectif.
                </p>
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                WhatsApp
              </a>
            </div>
          </SoftReveal>
        </div>
      </section>

      {/* ✅ Solutions (Tabs animés + checkmarks) */}
      <section id="solutions" className="border-t border-neutral-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <SoftReveal>
            <h2 className="text-3xl font-extrabold">
              Choisis ton profil → on te donne la bonne solution
            </h2>
            <p className="mt-2 max-w-3xl text-neutral-700">
              Pas de pack au hasard : on adapte selon{" "}
              <strong>ta réalité</strong>, ton objectif et ton budget.
            </p>
          </SoftReveal>

          <div className="mt-8">
            <Tabs
              value={segment}
              onChange={setSegment}
              items={[
                { key: "individuels", label: "Individuels" },
                { key: "pme", label: "PME" },
                { key: "b2b", label: "B2B" },
              ]}
            />

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={segment}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.35, ease: "easeOut" }
                  }
                >
                  <SolutionPanel
                    badge={current.badge}
                    subtitle={current.subtitle}
                    title={current.title}
                    pitch={current.pitch}
                    bullets={current.bullets}
                    result={current.result}
                    cta={current.cta}
                    highlight={Boolean((current as any).highlight)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <SoftReveal delay={0.05}>
              <div className="mt-8 rounded-3xl bg-neutral-900 p-8 text-white">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xl font-extrabold">
                      On valide ta meilleure option en 3 questions.
                    </p>
                    <p className="mt-1 text-white/80">
                      Profil • Objectif • Pays (MDG/MU) → devis rapide WhatsApp.
                    </p>
                  </div>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
                  >
                    Demander un devis (WhatsApp)
                  </a>
                </div>
              </div>
            </SoftReveal>
          </div>
        </div>
      </section>

      {/* ✅ Process */}
      <section id="process" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <SoftReveal>
            <h2 className="text-3xl font-extrabold">
              Notre process (simple et efficace)
            </h2>
            <p className="mt-2 max-w-3xl text-neutral-700">
              Tu sais toujours où on va : on analyse, on clarifie, puis on exécute.
            </p>
          </SoftReveal>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <SoftReveal delay={0.05}>
              <ProcessCard
                step="01"
                title="Audit"
                desc="On comprend ton business, ton offre, tes clients et tes blocages."
                bullets={[
                  "Objectif + cible + positionnement",
                  "Analyse rapide de tes contenus / pages",
                  "Priorités pour gagner vite",
                ]}
              />
            </SoftReveal>

            <SoftReveal delay={0.1}>
              <ProcessCard
                step="02"
                title="Plan"
                desc="Une stratégie courte, claire et actionnable (pas un doc de 50 pages)."
                bullets={[
                  "Plan contenu / pub / prospection",
                  "Messages, angles, offres, CTA",
                  "KPIs simples (ce qu’on mesure)",
                ]}
                highlight
              />
            </SoftReveal>

            <SoftReveal delay={0.15}>
              <ProcessCard
                step="03"
                title="Exécution"
                desc="On fait le travail : visuels, campagnes, scripts, séquences… et on optimise."
                bullets={[
                  "Création (Canva / UGC / Figma)",
                  "Lancement & optimisation",
                  "Suivi + itérations rapides",
                ]}
              />
            </SoftReveal>
          </div>
        </div>
      </section>

      {/* ✅ Avis (Supabase + Motion + rotation 30s en blocs de 6) */}
      <section id="avis" className="border-t border-neutral-200 bg-white">
        <AvisClients />

        <div className="mx-auto w-full max-w-6xl px-4 pb-14">
          <SoftReveal delay={0.05}>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Nous contacter
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold hover:border-neutral-400"
              >
                WhatsApp
              </a>
            </div>
          </SoftReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image
                src="/logo.png"
                alt="Dynamic Idea"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Dynamic Idea</p>
              <p className="text-xs text-neutral-600">
                Outils Pro + Stratégie Marketing
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-neutral-700">
            <a href="#offres" className="hover:text-red-600">
              Offres
            </a>
            <a href="#prix" className="hover:text-red-600">
              Prix
            </a>
            <a href="#solutions" className="hover:text-red-600">
              Solutions
            </a>
            <a href="#process" className="hover:text-red-600">
              Process
            </a>
            <a href="#avis" className="hover:text-red-600">
              Avis
            </a>
            <Link href="/contact" className="hover:text-red-600">
              Contact
            </Link>
          </div>

          <p className="text-xs text-neutral-600">© 2026 Dynamic Idea.</p>
        </div>
      </footer>
    </main>
  );
}

/* ----------------- UI Components ----------------- */

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs text-neutral-600">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

/* ✅ ÉTAGE 2 : Preuve sociale (Hero) — maintenant depuis Supabase + rotation 10s */
function ProofSocialCard() {
  const reduce = useReducedMotion();

  const [avis, setAvis] = useState<AvisClient[]>([]);
  const [index, setIndex] = useState(0);

  const timerRef = useRef<number | null>(null);

  const avisActuel = useMemo(() => {
    if (!avis.length) return null;
    return avis[index % avis.length];
  }, [avis, index]);

  useEffect(() => {
    let isMounted = true;

    async function chargerAvisHero() {
      const { data, error } = await supabase
        .from("avis_clients")
        .select("id, nom, avis, note, actif, created_at")
        .eq("actif", true)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (!error && data) {
        setAvis(data as AvisClient[]);
        setIndex(0);
      }
    }

    chargerAvisHero();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);

    // Rotation toutes les 10 secondes seulement si on a plusieurs avis
    if (avis.length <= 1) return;

    timerRef.current = window.setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 10000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [avis.length]);

  const fallbackQuote =
    "Image plus pro + contenus réguliers. Résultat : plus de demandes qualifiées sur WhatsApp.";
  const fallbackName = "Jérôme";

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-neutral-200 bg-white p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">Ils ont vu la différence</p>

          {/* ✅ Avis Supabase qui change toutes les 10s */}
          <AnimatePresence mode="wait">
            <motion.p
              key={avisActuel?.id ?? "fallback"}
              className="mt-1 text-sm text-neutral-700 italic"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={reduce ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
            >
              “{avisActuel?.avis ?? fallbackQuote}”
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ✅ Seulement les 5 étoiles affichées ici */}
        <Stars />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <AvatarBubble initials={(avisActuel?.nom ?? fallbackName).slice(0, 2).toUpperCase()} />
        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`nom-${avisActuel?.id ?? "fallback"}`}
              className="text-sm font-bold"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={reduce ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
            >
              {avisActuel?.nom ?? fallbackName}
            </motion.p>
          </AnimatePresence>

          <p className="text-xs text-neutral-600">Client • Madagascar</p>
        </div>
      </div>
    </motion.div>
  );
}

function Stars() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
      className="inline-flex shrink-0 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white"
      aria-label="5 étoiles"
    >
      ★★★★★
    </motion.span>
  );
}

function AvatarBubble({ initials }: { initials: string }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-extrabold text-white">
      {initials}
    </div>
  );
}

/* ✅ ÉTAGE 3 : Stack technique condensée (effet cadeau) */
function ProSuiteCard() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-neutral-200 bg-white p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">Suite Pro incluse</p>
        <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
          Offerte
        </span>
      </div>

      <p className="mt-1 text-sm text-neutral-700">
        Ne payez plus vos licences. Tout est inclus pour créer sans limite.
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <ToolPill label="Canva" />
        <ToolPill label="LinkedIn" />
        <ToolPill label="Figma" />
      </div>

      <p className="mt-3 text-xs text-neutral-600">
        Bonus : on vous guide pour transformer vos contenus en conversions.
      </p>
    </motion.div>
  );
}

function ToolPill({ label }: { label: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
      className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-semibold"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-extrabold text-white">
        ✓
      </span>
      <span>{label}</span>
    </motion.div>
  );
}

/* ✅ ÉTAGE 4 : Déclencheur CTA */
function TriggerCard() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-neutral-200 bg-white p-4"
    >
      <p className="font-semibold">On commence quand ?</p>
      <p className="mt-1 text-sm text-neutral-700">
        Audit de votre présence actuelle (10 min) offert via WhatsApp.
      </p>

      <motion.a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-neutral-800"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
      >
        Réserver mon audit (WhatsApp)
      </motion.a>

      <p className="mt-2 text-center text-xs text-neutral-500">
        Réponse rapide • Devis clair
      </p>
    </motion.div>
  );
}

function FloatingBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={[
        "rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-800 shadow-sm",
        className,
      ].join(" ")}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={
        reduce
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1, y: [0, -8, 0] }
      }
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {label}
    </motion.div>
  );
}

function OfferCard({
  title,
  tag,
  points,
}: {
  title: string;
  tag: string;
  points: string[];
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <p className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
        {tag}
      </p>
      <p className="mt-3 text-lg font-bold">{title}</p>

      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-red-600" />
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <a
        href="#prix"
        className="mt-6 inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-400"
      >
        Voir le prix
      </a>
    </motion.div>
  );
}

function PriceCard({
  name,
  ariary,
  rupees,
  note,
}: {
  name: string;
  ariary: string;
  rupees: string;
  note: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <p className="text-lg font-bold">{name}</p>
      <p className="mt-2 text-3xl font-extrabold">{ariary}</p>
      <p className="mt-1 text-sm text-neutral-700">{rupees}</p>
      <p className="mt-4 text-sm text-neutral-700">{note}</p>
      <Link
        href="/contact"
        className="mt-6 inline-flex w-full justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Commander / Demander info
      </Link>
    </motion.div>
  );
}

/* ✅ Tabs animés */
function Tabs({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (key: any) => void;
  items: { key: string; label: string }[];
}) {
  const reduce = useReducedMotion();

  return (
    <div className="inline-flex w-full items-center justify-between rounded-full border border-neutral-200 bg-neutral-50 p-1 md:w-auto">
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={[
              "relative rounded-full px-4 py-2 text-sm font-semibold transition",
              active
                ? "text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900",
            ].join(" ")}
          >
            {active && (
              <motion.span
                layoutId="tabPill"
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 500, damping: 38 }
                }
              />
            )}
            <span className="relative z-10">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ✅ Panel avec checkmarks animés */
function SolutionPanel({
  badge,
  subtitle,
  title,
  pitch,
  bullets,
  result,
  cta,
  highlight,
}: {
  badge: string;
  subtitle: string;
  title: string;
  pitch: string;
  bullets: string[];
  result: string;
  cta: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border bg-white p-6 shadow-sm",
        highlight ? "border-red-600" : "border-neutral-200",
      ].join(" ")}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="inline-flex w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-extrabold tracking-wide text-neutral-900">
            {badge}
          </p>
          <p className="mt-2 text-xs font-semibold text-neutral-600">
            {subtitle}
          </p>
          <p className="mt-4 text-2xl font-extrabold">{title}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700">
            {pitch}
          </p>
        </div>

        {highlight && (
          <span className="mt-3 inline-flex w-fit rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white md:mt-0">
            Le plus demandé
          </span>
        )}
      </div>

      <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
        <p className="text-xs font-extrabold uppercase tracking-wide text-neutral-600">
          Ce qu’on fait concrètement
        </p>

        <motion.ul
          className="mt-3 space-y-2 text-sm text-neutral-700"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {bullets.map((b) => (
            <motion.li
              key={b}
              className="flex gap-2"
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <CheckMark />
              <span>{b}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <p className="mt-4 text-sm font-semibold text-neutral-900">{result}</p>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className={[
          "mt-6 inline-flex w-full justify-center rounded-full px-4 py-3 text-sm font-extrabold",
          highlight
            ? "bg-red-600 text-white hover:bg-red-700"
            : "border border-neutral-300 hover:border-neutral-400",
        ].join(" ")}
      >
        {cta}
      </a>

      <p className="mt-3 text-center text-xs text-neutral-500">
        Devis rapide pour avoir plus d'impact
      </p>
    </div>
  );
}

/* ✅ Checkmark animé */
function CheckMark() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white"
      initial={{ scale: 0.85, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={reduce ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
      aria-hidden="true"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <motion.path
          d="M2 6.2L4.3 8.5L10 2.8"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
        />
      </svg>
    </motion.span>
  );
}

/* ✅ Process card */
function ProcessCard({
  step,
  title,
  desc,
  bullets,
  highlight,
}: {
  step: string;
  title: string;
  desc: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className={[
        "rounded-3xl border bg-white p-6 shadow-sm",
        highlight ? "border-red-600" : "border-neutral-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-extrabold text-neutral-900">{step}</p>
        {highlight && (
          <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Clé
          </span>
        )}
      </div>

      <p className="mt-3 text-xl font-extrabold">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700">{desc}</p>

      <motion.ul
        className="mt-4 space-y-2 text-sm text-neutral-700"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        {bullets.map((b) => (
          <motion.li
            key={b}
            className="flex gap-2"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <CheckMark />
            <span>{b}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

/* (Conservé au cas où tu l'utilises ailleurs) */
function Testimonial({
  name,
  title,
  quote,
}: {
  name: string;
  title: string;
  quote: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-xs text-neutral-600">{title}</p>
        </div>
        <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
          ★★★★★
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-neutral-700">“{quote}”</p>
    </motion.div>
  );
}
