import Link from "next/link";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";

type Category = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

type Post = {
  id: number;
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
};

function toCloudFrontUrl(url?: string) {
  if (!url) return undefined;

  return url.replace(
    /^https?:\/\/[^/]+\/wp-content\/uploads\//,
    "https://d3fqb2te8bdvc5.cloudfront.net/wp-content/uploads/"
  );
}

function getFeaturedImage(post: Post) {
  const source =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return toCloudFrontUrl(source);
}

function getAltText(post: Post) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ||
    ""
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/categories?slug=${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch category");
  }

  const categories: Category[] = await res.json();

  return categories[0] ?? null;
}

async function getPostsByCategory(
  categoryId: number
): Promise<Post[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/posts?categories=${categoryId}&_embed`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(category.id);

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      {/* AREA TITLE */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

        <p className="mb-4 text-xs font-bold tracking-[0.35em] text-neutral-500">
          AREA
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          {category.name}
        </h1>

        <div className="mt-8 flex items-center gap-4">

          <span className="h-px w-12 bg-black" />

          <p className="text-sm font-medium tracking-[0.15em] text-neutral-500">
            {posts.length} RIDES
          </p>

        </div>

      </section>

      {/* POSTS */}
      <section className="border-t border-black/10 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

          {posts.length === 0 ? (

            <p className="text-neutral-500">
              このエリアの記事はまだありません。
            </p>

          ) : (

            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">

              {posts.map((post) => {
                const featuredImage =
                  getFeaturedImage(post);

                return (
                  <article
                    key={post.id}
                    className="group"
                  >

                    <Link
                      href={`/touring/${post.slug}`}
                    >

                      <div className="overflow-hidden rounded-2xl bg-neutral-100">

                        {featuredImage ? (
                          <img
                            src={featuredImage}
                            alt={getAltText(post)}
                            className="
                              aspect-[16/10]
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              group-hover:scale-[1.025]
                            "
                          />
                        ) : (
                          <div className="aspect-[16/10] bg-neutral-200" />
                        )}

                      </div>

                    </Link>

                    <div className="mt-6">

                      <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-neutral-500">
                        {formatDate(post.date)}
                      </p>

                      <Link href={`/touring/${post.slug}`}>

                        <h2
                          className="
                            text-2xl
                            font-bold
                            leading-snug
                            transition-opacity
                            hover:opacity-60
                            md:text-3xl
                          "
                          dangerouslySetInnerHTML={{
                            __html: post.title.rendered,
                          }}
                        />

                      </Link>

                      <div
                        className="
                          mt-4
                          line-clamp-2
                          text-sm
                          leading-7
                          text-neutral-500
                          md:text-base
                        "
                        dangerouslySetInnerHTML={{
                          __html: post.excerpt.rendered,
                        }}
                      />

                      <Link
                        href={`/touring/${post.slug}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                      >
                        READ →
                      </Link>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </div>

      </section>

      {/* BACK */}
      <section className="border-t border-black/10">

        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">

          <Link
            href="/area"
            className="inline-flex items-center gap-3 text-sm font-bold tracking-[0.15em]"
          >
            ← BACK TO AREAS
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-950 text-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-10">

          <div>

            <p className="text-xl font-black tracking-[0.18em]">
              TORA ROAD
            </p>

            <p className="mt-2 text-xs tracking-[0.25em] text-neutral-500">
              MOTORCYCLE TOURING JOURNAL
            </p>

          </div>

          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} TORA ROAD
          </p>

        </div>

      </footer>

    </main>
  );
}