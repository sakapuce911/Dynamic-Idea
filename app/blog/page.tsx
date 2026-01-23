// File: dynamic-idea/app/blog/page.tsx
import Image from "next/image";
import Link from "next/link";
import { supabaseServer } from "@/src/lib/supabaseServer";

type BlogPost = {
  id: string;
  titre: string;
  slug: string;
  image_url: string | null;
  paragraphe_1: string | null;
  paragraphe_2: string | null;
  paragraphe_3: string | null;
  featured: boolean | null;
  created_at: string;
};

function excerpt(text?: string | null, max = 140) {
  const t = (text ?? "").trim();
  if (!t) return "";
  return t.length <= max ? t : t.slice(0, max).trim() + "…";
}

export default async function BlogPage() {
  const { data } = await supabaseServer
    .from("blog_posts")
    .select(
      "id, titre, slug, image_url, paragraphe_1, paragraphe_2, paragraphe_3, featured, created_at"
    )
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as BlogPost[];

  const featured = posts.find((p) => p.featured === true) ?? null;
  const others = posts.filter((p) => (featured ? p.id !== featured.id : true));

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-9 w-9">
              <Image src="/logo.png" alt="Dynamic Idea" fill className="object-contain" priority />
            </div>
            <span className="text-sm font-semibold tracking-wide">Dynamic Idea</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm hover:text-red-600">Accueil</Link>
            <Link
              href="/contact"
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Nous contacter
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <p className="text-xs font-extrabold tracking-wide text-neutral-600">BLOG</p>
        <h1 className="mt-2 text-4xl font-extrabold">Marketing digital & outils Pro</h1>
        <p className="mt-3 max-w-3xl text-neutral-700">
          Conseils concrets pour gagner en visibilité, générer des leads et structurer une stratégie efficace.
          Cible internationale, équipes basées à Madagascar & Maurice.
        </p>

        {featured && (
          <Link
            href={`/blog/${encodeURIComponent((featured.slug || "").trim())}`}
            className="group mt-10 block overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative min-h-[260px]">
                <Image
                  src={featured.image_url || "/logo.png"}
                  alt={featured.titre}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-8">
                <p className="inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                  À la une
                </p>

                <h2 className="mt-4 text-3xl font-extrabold group-hover:text-red-600">
                  {featured.titre}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                  {excerpt(featured.paragraphe_1, 220)}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900">
                  Lire l’article <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {others.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${encodeURIComponent((p.slug || "").trim())}`}
              className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="relative h-44">
                <Image src={p.image_url || "/logo.png"} alt={p.titre} fill className="object-cover" />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-extrabold group-hover:text-red-600">{p.titre}</h3>
                <p className="mt-2 text-sm text-neutral-700">{excerpt(p.paragraphe_1, 130)}</p>
                <div className="mt-4 text-sm font-semibold text-neutral-900">
                  Lire <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold">© 2026 Dynamic Idea</p>
          <div className="flex gap-4 text-sm text-neutral-700">
            <Link href="/" className="hover:text-red-600">Accueil</Link>
            <Link href="/contact" className="hover:text-red-600">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
