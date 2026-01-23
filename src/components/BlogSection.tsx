"use client";

// File: src/components/BlogSection.tsx
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";

type BlogPost = {
  id: string;
  titre: string;
  slug: string;
  image_url: string;
  paragraphe_1: string;
  featured: boolean;
  created_at: string;
};

export default function BlogSection() {
  const [featured, setFeatured] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function loadBlog() {
      // Article à la une
      const { data: featuredPost } = await supabase
        .from("blog_posts")
        .select("id, titre, slug, image_url, paragraphe_1, featured, created_at")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Autres articles
      const { data: otherPosts } = await supabase
        .from("blog_posts")
        .select("id, titre, slug, image_url, paragraphe_1, featured, created_at")
        .eq("featured", false)
        .order("created_at", { ascending: false })
        .limit(3);

      setFeatured(featuredPost ?? null);
      setPosts(otherPosts ?? []);
    }

    loadBlog();
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14">
      <h2 className="text-3xl font-extrabold">Blog & Conseils marketing</h2>
      <p className="mt-2 max-w-2xl text-neutral-700">
        Stratégie, outils et méthodes pour générer des résultats concrets.
      </p>

      {/* ARTICLE FEATURED */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="mt-8 block overflow-hidden rounded-3xl border border-neutral-200 bg-white hover:shadow-md transition"
        >
          <div className="relative aspect-[16/7] w-full">
            <Image
              src={featured.image_url}
              alt={featured.titre}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6">
            <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              À la une
            </span>
            <h3 className="mt-3 text-2xl font-extrabold">
              {featured.titre}
            </h3>
            <p className="mt-2 text-neutral-700 line-clamp-2">
              {featured.paragraphe_1}
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-red-600">
              Lire l’article →
            </span>
          </div>
        </Link>
      )}

      {/* AUTRES ARTICLES */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="rounded-2xl border border-neutral-200 bg-white p-4 hover:shadow-md transition"
          >
            <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-xl">
              <Image
                src={post.image_url}
                alt={post.titre}
                fill
                className="object-cover"
              />
            </div>
            <h4 className="text-lg font-bold">{post.titre}</h4>
            <p className="mt-1 text-sm text-neutral-700 line-clamp-3">
              {post.paragraphe_1}
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-red-600">
              Lire →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/blog"
          className="inline-flex rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold hover:border-neutral-400"
        >
          Voir tous les articles
        </Link>
      </div>
    </div>
  );
}
