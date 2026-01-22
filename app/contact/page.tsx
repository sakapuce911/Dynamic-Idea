"use client";

// File: dynamic-idea/app/contact/page.tsx
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const WHATSAPP_NUMBER = "23057261909";
const EMAIL = "dynamicbusiness.idea@gmail.com";

const WHATSAPP_LINK =
  "https://wa.me/" +
  WHATSAPP_NUMBER +
  "?text=" +
  encodeURIComponent(
    "Bonjour Dynamic Idea ! Je veux un devis. Mon profil : (Individuel / PME / B2B). Mon objectif : ... Mon secteur : ... Mon pays : ... Mon budget : ..."
  );

type SegmentKey = "individuel" | "pme" | "b2b";

/**
 * Liste des pays (affichage FR).
 * Source: ISO 3166 (noms FR usuels) — trié alphabétiquement.
 * (Tu peux ajouter/adapter des libellés si tu veux une variante “Madagascar (MDG)” etc.)
 */
const COUNTRIES_FR: { code: string; name: string }[] = [
  { code: "AF", name: "افغانستان (Afghanistan)" },
  { code: "ZA", name: "Afrique du Sud" },
  { code: "AL", name: "Albanie" },
  { code: "DZ", name: "Algérie" },
  { code: "DE", name: "Allemagne" },
  { code: "AD", name: "Andorre" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua-et-Barbuda" },
  { code: "SA", name: "Arabie saoudite" },
  { code: "AR", name: "Argentine" },
  { code: "AM", name: "Arménie" },
  { code: "AU", name: "Australie" },
  { code: "AT", name: "Autriche" },
  { code: "AZ", name: "Azerbaïdjan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahreïn" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbade" },
  { code: "BE", name: "Belgique" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Bénin" },
  { code: "BT", name: "Bhoutan" },
  { code: "BY", name: "Biélorussie" },
  { code: "BO", name: "Bolivie" },
  { code: "BA", name: "Bosnie-Herzégovine" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brésil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgarie" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodge" },
  { code: "CM", name: "Cameroun" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cap-Vert" },
  { code: "CL", name: "Chili" },
  { code: "CN", name: "Chine" },
  { code: "CY", name: "Chypre" },
  { code: "CO", name: "Colombie" },
  { code: "KM", name: "Comores" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo (RDC)" },
  { code: "KP", name: "Corée du Nord" },
  { code: "KR", name: "Corée du Sud" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d’Ivoire" },
  { code: "HR", name: "Croatie" },
  { code: "CU", name: "Cuba" },
  { code: "DK", name: "Danemark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominique" },
  { code: "EG", name: "Égypte" },
  { code: "AE", name: "Émirats arabes unis" },
  { code: "EC", name: "Équateur" },
  { code: "ER", name: "Érythrée" },
  { code: "ES", name: "Espagne" },
  { code: "EE", name: "Estonie" },
  { code: "SZ", name: "Eswatini" },
  { code: "US", name: "États-Unis" },
  { code: "ET", name: "Éthiopie" },
  { code: "FJ", name: "Fidji" },
  { code: "FI", name: "Finlande" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambie" },
  { code: "GE", name: "Géorgie" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Grèce" },
  { code: "GD", name: "Grenade" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinée" },
  { code: "GQ", name: "Guinée équatoriale" },
  { code: "GW", name: "Guinée-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haïti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hongrie" },
  { code: "IN", name: "Inde" },
  { code: "ID", name: "Indonésie" },
  { code: "IQ", name: "Irak" },
  { code: "IR", name: "Iran" },
  { code: "IE", name: "Irlande" },
  { code: "IS", name: "Islande" },
  { code: "IL", name: "Israël" },
  { code: "IT", name: "Italie" },
  { code: "JM", name: "Jamaïque" },
  { code: "JP", name: "Japon" },
  { code: "JO", name: "Jordanie" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KG", name: "Kirghizistan" },
  { code: "KI", name: "Kiribati" },
  { code: "KW", name: "Koweït" },
  { code: "LA", name: "Laos" },
  { code: "LS", name: "Lesotho" },
  { code: "LV", name: "Lettonie" },
  { code: "LB", name: "Liban" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libye" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lituanie" },
  { code: "LU", name: "Luxembourg" },
  { code: "MK", name: "Macédoine du Nord" },
  { code: "MG", name: "Madagascar" },
  { code: "MY", name: "Malaisie" },
  { code: "MW", name: "Malawi" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malte" },
  { code: "MA", name: "Maroc" },
  { code: "MH", name: "Marshall (Îles)" },
  { code: "MU", name: "Maurice" },
  { code: "MR", name: "Mauritanie" },
  { code: "MX", name: "Mexique" },
  { code: "FM", name: "Micronésie" },
  { code: "MD", name: "Moldavie" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolie" },
  { code: "ME", name: "Monténégro" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar (Birmanie)" },
  { code: "NA", name: "Namibie" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Népal" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigéria" },
  { code: "NO", name: "Norvège" },
  { code: "NZ", name: "Nouvelle-Zélande" },
  { code: "OM", name: "Oman" },
  { code: "UG", name: "Ouganda" },
  { code: "UZ", name: "Ouzbékistan" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palaos" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papouasie-Nouvelle-Guinée" },
  { code: "PY", name: "Paraguay" },
  { code: "NL", name: "Pays-Bas" },
  { code: "PE", name: "Pérou" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Pologne" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Roumanie" },
  { code: "GB", name: "Royaume-Uni" },
  { code: "RU", name: "Russie" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint-Christophe-et-Niévès" },
  { code: "LC", name: "Sainte-Lucie" },
  { code: "SM", name: "Saint-Marin" },
  { code: "VC", name: "Saint-Vincent-et-les-Grenadines" },
  { code: "SV", name: "Salvador" },
  { code: "WS", name: "Samoa" },
  { code: "ST", name: "Sao Tomé-et-Principe" },
  { code: "SN", name: "Sénégal" },
  { code: "RS", name: "Serbie" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapour" },
  { code: "SK", name: "Slovaquie" },
  { code: "SI", name: "Slovénie" },
  { code: "SO", name: "Somalie" },
  { code: "SD", name: "Soudan" },
  { code: "SS", name: "Soudan du Sud" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SE", name: "Suède" },
  { code: "CH", name: "Suisse" },
  { code: "SR", name: "Suriname" },
  { code: "SY", name: "Syrie" },
  { code: "TJ", name: "Tadjikistan" },
  { code: "TZ", name: "Tanzanie" },
  { code: "TD", name: "Tchad" },
  { code: "CZ", name: "Tchéquie" },
  { code: "TH", name: "Thaïlande" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinité-et-Tobago" },
  { code: "TN", name: "Tunisie" },
  { code: "TM", name: "Turkménistan" },
  { code: "TR", name: "Turquie" },
  { code: "TV", name: "Tuvalu" },
  { code: "UA", name: "Ukraine" },
  { code: "UY", name: "Uruguay" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Viêt Nam" },
  { code: "YE", name: "Yémen" },
  { code: "ZM", name: "Zambie" },
  { code: "ZW", name: "Zimbabwe" },

  // Territoires/États non-membres ONU souvent attendus par les utilisateurs
  { code: "TW", name: "Taïwan" },
  { code: "PS", name: "Palestine" },
  { code: "XK", name: "Kosovo" },
];

export default function ContactPage() {
  const reduce = useReducedMotion();

  // Parallax doux (Swello vibe)
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -28]);
  const blobOpacity = useTransform(scrollYProgress, [0, 1], [0.9, 0.55]);

  // Form state
  const [segment, setSegment] = useState<SegmentKey>("pme");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [country, setCountry] = useState<string>("choisir");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");

  const quickGoals = useMemo(
    () => [
      "Plus de visibilité",
      "Plus de messages WhatsApp",
      "Vendre plus (offre + créa + ads)",
      "Prospection B2B (RDV qualifiés)",
      "Personal branding (LinkedIn / Reels)",
      "Audit & plan d’action",
    ],
    []
  );

  const waPrefill = useMemo(() => {
    const countryName =
      COUNTRIES_FR.find((c) => c.code === country)?.name || country;

    const txt =
      `Bonjour Dynamic Idea !%0A` +
      `Profil : ${segment.toUpperCase()}%0A` +
      `Pays : ${countryName}%0A` +
      `Nom : ${name || "-"}%0A` +
      `Email : ${mail || "-"}%0A` +
      `Objectif : ${goal || "-"}%0A` +
      `Message : ${message || "-"}`;
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + txt;
  }, [segment, country, name, mail, goal, message]);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-9 w-9">
              <Image src="/logo.png" alt="Dynamic Idea" fill className="object-contain" priority />
            </div>
            <span className="text-sm font-semibold tracking-wide">Dynamic Idea</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/#offres" className="text-sm hover:text-red-600">Offres</Link>
            <Link href="/#prix" className="text-sm hover:text-red-600">Prix</Link>
            <Link href="/#solutions" className="text-sm hover:text-red-600">Solutions</Link>
            <Link href="/#avis" className="text-sm hover:text-red-600">Avis</Link>
            <Link href="/contact" className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              Nous contacter
            </Link>
          </nav>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="md:hidden rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-400"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef as any} className="relative overflow-hidden">
        {/* blobs */}
        <motion.div
          style={{ y: blobY, opacity: blobOpacity }}
          className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-red-100 blur-3xl"
        />
        <motion.div
          style={{ y: blobY, opacity: blobOpacity }}
          className="pointer-events-none absolute -bottom-56 right-[-160px] -z-10 h-[620px] w-[620px] rounded-full bg-neutral-100 blur-3xl"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-white to-neutral-50" />

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:py-20">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.55, ease: "easeOut" }}
          >
            <p className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
              Contact rapide 
              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-600" />
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Parlons de votre <span className="text-red-600">objectif</span>
              <br />
              et transformons-le en <span className="text-red-600">résultats</span>.
            </h1>

            <p className="mt-4 text-base leading-relaxed text-neutral-700">
              Dites-nous votre profil (Individuel / PME / B2B) et votre objectif.
              On vous répond rapidement avec une proposition simple, claire et actionnable.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={waPrefill}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-red-700"
              >
                WhatsApp (devis rapide)
              </a>

              <a
                href={`mailto:${EMAIL}`}
                className="rounded-full border border-neutral-300 px-6 py-3 text-center text-sm font-semibold hover:border-neutral-400"
              >
                Envoyer un email
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              <MiniCard label="Zone" value="Monde" />
              <MiniCard label="Support" value="WhatsApp / Email" />
              <MiniCard label="Délai" value="Réponse rapide" />
            </div>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
              <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                ★★★★★
              </span>
              <p className="text-sm text-neutral-700">
                4,9/5 • clients • orienté résultats
              </p>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.65, ease: "easeOut", delay: 0.08 }}
            className="relative"
          >
            <FloatingChip className="absolute -top-4 left-6" label="Audit (10 min) offert" />
            <FloatingChip className="absolute top-16 -right-4" label="Devis clair" />
            <FloatingChip className="absolute bottom-8 -left-4" label="Action rapide" />

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-bold">Demande de contact</p>
                <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                  Simple
                </span>
              </div>

              <p className="mt-1 text-sm text-neutral-700">
                Remplis 3 infos → on te propose la meilleure solution.
              </p>

              {/* Tabs */}
              <div className="mt-5">
                <p className="text-xs font-semibold text-neutral-600">Votre profil</p>
                <SegmentTabs
                  value={segment}
                  onChange={setSegment}
                  items={[
                    { key: "individuel", label: "Individuels" },
                    { key: "pme", label: "PME" },
                    { key: "b2b", label: "B2B" },
                  ]}
                />
              </div>

              {/* Fields */}
              <div className="mt-5 grid grid-cols-1 gap-4">
                <Field label="Nom" placeholder="Votre nom" value={name} onChange={setName} />
                <Field label="Email" placeholder="Votre email" value={mail} onChange={setMail} type="email" />

                {/* ✅ FIX dépassement: on force min-w-0 + w-full partout */}
                <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                  <SelectField
                    label="Pays"
                    value={country}
                    onChange={setCountry}
                    options={[
                      { value: "", label: "Choisir..." },
                      ...COUNTRIES_FR.map((c) => ({ value: c.code, label: c.name })),
                    ]}
                  />
                  <SelectField
                    label="Objectif"
                    value={goal}
                    onChange={setGoal}
                    options={[
                      { value: "", label: "Choisir..." },
                      ...quickGoals.map((g) => ({ value: g, label: g })),
                    ]}
                  />
                </div>

                <TextArea
                  label="Message"
                  placeholder="Ex: je veux vendre plus / avoir + de messages / lancer une offre..."
                  value={message}
                  onChange={setMessage}
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waPrefill}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Envoyer sur WhatsApp
                </a>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent("Demande de devis — Dynamic Idea")}&body=${encodeURIComponent(
                    `Bonjour Dynamic Idea,\n\nProfil : ${segment.toUpperCase()}\nPays : ${
                      COUNTRIES_FR.find((c) => c.code === country)?.name || "-"
                    }\nNom : ${name}\nEmail : ${mail}\nObjectif : ${goal}\nMessage : ${message}\n\nMerci !`
                  )}`}
                  className="inline-flex w-full justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold hover:border-neutral-400"
                >
                  Envoyer par email
                </a>
              </div>

              <p className="mt-3 text-center text-xs text-neutral-500">
                Astuce : plus ton objectif est précis, plus notre réponse sera rapide.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image src="/logo.png" alt="Dynamic Idea" fill className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold">Dynamic Idea</p>
              <p className="text-xs text-neutral-600">WhatsApp / Email</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-neutral-700">
            <Link href="/" className="hover:text-red-600">Accueil</Link>
            <Link href="/#solutions" className="hover:text-red-600">Solutions</Link>
            <Link href="/#process" className="hover:text-red-600">Process</Link>
            <Link href="/#avis" className="hover:text-red-600">Avis</Link>
          </div>

          <p className="text-xs text-neutral-600">© 2026 Dynamic Idea.</p>
        </div>
      </footer>
    </main>
  );
}

/* ----------- Components ----------- */

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs text-neutral-600">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function FloatingChip({ label, className }: { label: string; className: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={[
        "pointer-events-none rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-800 shadow-sm",
        className,
      ].join(" ")}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={reduce ? { duration: 0 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {label}
    </motion.div>
  );
}

function SegmentTabs({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (k: any) => void;
  items: { key: string; label: string }[];
}) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-2 inline-flex w-full items-center justify-between rounded-full border border-neutral-200 bg-neutral-50 p-1">
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={[
              "relative flex-1 rounded-full px-4 py-2 text-sm font-semibold transition",
              active ? "text-neutral-900" : "text-neutral-600 hover:text-neutral-900",
            ].join(" ")}
          >
            {active && (
              <motion.span
                layoutId="segPill"
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }}
              />
            )}
            <span className="relative z-10">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-semibold text-neutral-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none transition focus:border-red-600"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-semibold text-neutral-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none transition focus:border-red-600"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-semibold text-neutral-600">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-600"
      />
    </label>
  );
}
