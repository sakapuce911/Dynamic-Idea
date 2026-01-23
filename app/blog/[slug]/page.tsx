// File: dynamic-idea/app/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/src/lib/supabaseServer";

// --------- Types ----------
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

// --------- Utils ----------
function safeText(v: any) {
  return typeof v === "string" ? v : "";
}

function normalizeSlug(s: string) {
  return safeText(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[’']/g, "-")
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// --------- Data ----------
async function fetchBySlug(slugParam: unknown) {
  const original = safeText(slugParam).trim();
  if (!original) return null;

  const clean = normalizeSlug(original);

  // 1) Match exact sur slug (clean)
  let { data, error } = await supabaseServer
    .from("blog_posts")
    .select(
      "id, titre, slug, image_url, paragraphe_1, paragraphe_2, paragraphe_3, featured, created_at"
    )
    .eq("slug", clean)
    .maybeSingle();

  if (!error && data) return data as BlogPost;

  // 2) Fallback: si tes slugs dans la DB ne sont pas clean, on tente aussi le "original"
  ({ data, error } = await supabaseServer
    .from("blog_posts")
    .select(
      "id, titre, slug, image_url, paragraphe_1, paragraphe_2, paragraphe_3, featured, created_at"
    )
    .eq("slug", original)
    .maybeSingle());

  if (!error && data) return data as BlogPost;

  return null;
}

// ✅ Next.js 16: params est une Promise => on unwrap
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBySlug(slug);

  if (!post) return { title: "Article - Dynamic Idea" };

  const description = safeText(post.paragraphe_1).slice(0, 150);

  return {
    title: `${post.titre} - Dynamic Idea`,
    description,
    openGraph: {
      title: post.titre,
      description,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const { slug } = await params;

  const post = await fetchBySlug(slug);
  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-red-600">Dynamic</span> Idea
          </Link>

          <Link
            href="/blog"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-400"
          >
            ← Retour au blog
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-4xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Blog • Dynamic Idea
        </p>

        <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
          {post.titre}
        </h1>

        {post.image_url ? (
          <div className="relative mt-6 aspect-[16/8] w-full overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
            <Image
              src={post.image_url}
              alt={post.titre}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <div className="prose prose-neutral mt-8 max-w-none">
          {safeText(post.paragraphe_1) ? <p>{post.paragraphe_1}</p> : null}
          {safeText(post.paragraphe_2) ? <p>{post.paragraphe_2}</p> : null}
          {safeText(post.paragraphe_3) ? <p>{post.paragraphe_3}</p> : null}
        </div>

        <div className="mt-10 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-lg font-bold">Besoin d’un coup de main ?</p>
          <p className="mt-1 text-sm text-neutral-700">
            On peut appliquer ces stratégies à ton business. Contact rapide via WhatsApp.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            Nous contacter
          </Link>
        </div>
      </article>
    </main>
  );
}
