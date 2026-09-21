import Link from "next/link";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";

type Term = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

type Post = {
  id: number;
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  meta?: {
    distance?: string;
    hotel?: string;
    road?: string;
    food?: string;
    map_embed_url?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    "wp:term"?: Term[][];
  };
};

function toCloudFrontUrl(url?: string) {
  if (!url) return undefined;

  return url.replace(
    /^https?:\/\/[^/]+\/wp-content\/uploads\//,
    "https://d3fqb2te8bdvc5.cloudfront.net/wp-content/uploads/"
  );
}

function replaceContentImageUrls(html: string) {
  return html.replaceAll(
    /https?:\/\/[^/"']+\/wp-content\/uploads\//g,
    "https://d3fqb2te8bdvc5.cloudfront.net/wp-content/uploads/"
  );
}

function getCategory(post: Post) {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];

  const category = terms.find(
    (term) => term.taxonomy === "category"
  );

  return category?.name || "TOURING";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function getPostBySlug(
  slug: string
): Promise<Post | null> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/posts?slug=${encodeURIComponent(slug)}&_embed`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const posts: Post[] = await res.json();

  return posts[0] ?? null;
}

export default async function TouringPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImageSource =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  const featuredImage =
    toCloudFrontUrl(featuredImageSource);

  const altText =
    post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "";

  const contentHtml =
    replaceContentImageUrls(post.content.rendered);

  const mapEmbedUrl =
    post.meta?.map_embed_url;

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-8 md:px-10 md:pt-12">

        <div className="relative overflow-hidden rounded-[28px] bg-neutral-900">

          {featuredImage ? (
            <img
              src={featuredImage}
              alt={altText}
              className="h-[420px] w-full object-cover md:h-[650px]"
            />
          ) : (
            <div className="h-[420px] bg-neutral-800 md:h-[650px]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 max-w-5xl p-7 text-white md:p-12">

            <div className="mb-5 flex items-center gap-4 text-xs font-semibold tracking-[0.18em]">

              <span className="rounded-full border border-white/50 px-4 py-2">
                {getCategory(post)}
              </span>

              <span className="text-white/70">
                {formatDate(post.date)}
              </span>

            </div>

            <h1
              className="max-w-4xl text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
              dangerouslySetInnerHTML={{
                __html: post.title.rendered,
              }}
            />

          </div>

        </div>

      </section>

      {/* ARTICLE */}
      <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">

        {/* RIDE DATA */}
        <section className="mb-16">

          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
            RIDE DATA
          </p>

          <div className="grid overflow-hidden rounded-2xl border border-black/10 bg-white sm:grid-cols-2">

            <div className="border-b border-black/10 p-6 sm:border-r">

              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                DISTANCE
              </p>

              <p className="mt-3 text-xl font-bold">
                {post.meta?.distance || "-"}
              </p>

            </div>

            <div className="border-b border-black/10 p-6">

              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                HOTEL
              </p>

              <p className="mt-3 text-xl font-bold">
                {post.meta?.hotel || "-"}
              </p>

            </div>

            <div className="border-b border-black/10 p-6 sm:border-b-0 sm:border-r">

              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                ROAD
              </p>

              <p className="mt-3 text-xl font-bold">
                {post.meta?.road || "-"}
              </p>

            </div>

            <div className="p-6">

              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                FOOD
              </p>

              <p className="mt-3 text-xl font-bold">
                {post.meta?.food || "-"}
              </p>

            </div>

          </div>

        </section>

        {/* ROUTE MAP */}
        {mapEmbedUrl && (
          <section className="mb-16">

            <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
              ROUTE MAP
            </p>

            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">

              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="480"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />

            </div>

          </section>
        )}

        {/* WORDPRESS BODY */}
        <div
          className="
            text-[17px]
            leading-8
            text-neutral-800

            [&_p]:mb-7

            [&_h2]:mb-6
            [&_h2]:mt-16
            [&_h2]:border-l-4
            [&_h2]:border-black
            [&_h2]:pl-5
            [&_h2]:text-3xl
            [&_h2]:font-bold

            [&_h3]:mb-4
            [&_h3]:mt-12
            [&_h3]:text-2xl
            [&_h3]:font-bold

            [&_img]:my-10
            [&_img]:w-full
            [&_img]:rounded-2xl

            [&_figure]:my-10

            [&_figcaption]:mt-3
            [&_figcaption]:text-center
            [&_figcaption]:text-sm
            [&_figcaption]:text-neutral-500

            [&_a]:font-medium
            [&_a]:underline
            [&_a]:underline-offset-4

            [&_ul]:my-7
            [&_ul]:list-disc
            [&_ul]:pl-6

            [&_ol]:my-7
            [&_ol]:list-decimal
            [&_ol]:pl-6

            [&_li]:mb-2

            [&_blockquote]:my-10
            [&_blockquote]:border-l-4
            [&_blockquote]:border-neutral-300
            [&_blockquote]:pl-6
            [&_blockquote]:italic
            [&_blockquote]:text-neutral-600
          "
          dangerouslySetInnerHTML={{
            __html: contentHtml,
          }}
        />

      </article>

      {/* BACK */}
      <section className="border-t border-black/10">

        <div className="mx-auto max-w-4xl px-6 py-16">

          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-sm font-bold tracking-[0.15em]"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>

            BACK TO JOURNAL
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