"use client";

// =====================================
// File: src/components/AvisClients.tsx
// Objectif :
// - Charger les avis depuis Supabase (table: avis_clients)
// - Afficher 6 avis à la fois (grille 3 colonnes x 2 lignes)
// - Changer de "bloc" (page) automatiquement toutes les 30 secondes
// - Animations via Framer Motion
// =====================================

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/src/lib/supabaseClient";

type AvisClient = {
  id: string;
  nom: string;
  avis: string;
  note: number | null;
  actif: boolean;
  created_at: string;
};

const PAGE_SIZE = 6;

function etoiles(note: number | null) {
  const n = Math.max(0, Math.min(5, note ?? 0));
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
}

export default function AvisClients() {
  const [avis, setAvis] = useState<AvisClient[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(avis.length / PAGE_SIZE));
  }, [avis.length]);

  const currentPageAvis = useMemo(() => {
    if (!avis.length) return [];
    const start = (pageIndex % pageCount) * PAGE_SIZE;
    return avis.slice(start, start + PAGE_SIZE);
  }, [avis, pageIndex, pageCount]);

  useEffect(() => {
    let isMounted = true;

    async function chargerAvis() {
      setLoading(true);
      setErreur(null);

      const { data, error } = await supabase
        .from("avis_clients")
        .select("id, nom, avis, note, actif, created_at")
        .eq("actif", true)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        setErreur("Impossible de charger les avis clients depuis Supabase.");
        setAvis([]);
        setPageIndex(0);
      } else {
        const rows = (data ?? []) as AvisClient[];
        setAvis(rows);
        setPageIndex(0);
      }

      setLoading(false);
    }

    chargerAvis();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Nettoyage interval
    if (timerRef.current) window.clearInterval(timerRef.current);

    // Pas besoin de tourner s'il n'y a qu'une page
    if (pageCount <= 1) return;

    timerRef.current = window.setInterval(() => {
      setPageIndex((prev) => (prev + 1) % pageCount);
    }, 30000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [pageCount]);

  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Avis clients</h2>
          <p className="mt-2 text-sm text-neutral-600">
            6 avis affichés à la fois — rotation automatique toutes les 30 secondes.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {loading && (
            <p className="text-sm text-neutral-600">Chargement des avis…</p>
          )}

          {!loading && erreur && (
            <p className="text-sm text-red-600">{erreur}</p>
          )}

          {!loading && !erreur && avis.length === 0 && (
            <p className="text-sm text-neutral-600">
              Aucun avis disponible pour le moment.
            </p>
          )}

          <AnimatePresence mode="wait">
            {!loading && !erreur && avis.length > 0 && (
              <motion.div
                key={`page-${pageIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                {/* Grille: 1 col (mobile) / 2 cols (sm) / 3 cols (md) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {currentPageAvis.map((a) => (
                    <motion.div
                      key={a.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.18 }}
                      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-neutral-900">{a.nom}</p>
                          <p className="mt-1 text-xs text-neutral-600">
                            {etoiles(a.note)}
                          </p>
                        </div>

                        <span
                          className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white"
                          aria-label="Avis"
                        >
                          Avis
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                        “{a.avis}”
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Indicateur de page (petits points) */}
                {pageCount > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {Array.from({ length: pageCount }).map((_, i) => {
                      const active = i === pageIndex;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPageIndex(i)}
                          aria-label={`Afficher le bloc d'avis ${i + 1}`}
                          className={[
                            "h-2.5 w-2.5 rounded-full transition",
                            active ? "bg-red-600" : "bg-neutral-300 hover:bg-neutral-400",
                          ].join(" ")}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Petit compteur */}
                {pageCount > 1 && (
                  <p className="mt-3 text-center text-xs text-neutral-500">
                    Bloc {pageIndex + 1} / {pageCount}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
