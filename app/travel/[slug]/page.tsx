import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import ViewCounter from "@/components/ViewCounter";
import { formatJournalDate } from "@/lib/journalDate";

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

  excerpt?: {
    rendered: string;
  };

  meta?: {
    journal_type?: string;

    journal_date?: string;
    journal_start_date?: string;
    journal_end_date?: string;

    country?: string;
    city?: string;
    hotel?: string;
    event?: string;
    transport_type?: string;
    transport_detail?: string;
    map_embed_url?: string;
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

function replaceContentImageUrls(html: string) {
  return html.replaceAll(
    /https?:\/\/[^/"']+\/wp-content\/uploads\//g,
    "https://d3fqb2te8bdvc5.cloudfront.net/wp-content/uploads/"
  );
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function createDescription(post: Post) {
  const source =
    post.excerpt?.rendered ||
    post.content.rendered;

  const text = stripHtml(source);

  if (!text) {
    return "Tora Roadの旅行記。";
  }

  return text.length > 120
    ? `${text.slice(0, 120)}…`
    : text;
}

function getTransportLabel(type?: string) {
  switch (type) {
    case "flight":
      return "FLIGHT";

    case "train":
      return "TRAIN";

    case "car":
      return "CAR";

    case "bus":
      return "BUS";

    case "ferry":
      return "FERRY";

    case "other":
      return "OTHER";

    default:
      return "-";
  }
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
    throw new Error("Failed to fetch travel post");
  }

  const posts: Post[] = await res.json();

  const post = posts[0];

  if (!post) {
    return null;
  }

  if (post.meta?.journal_type !== "travel") {
    return null;
  }

  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "記事が見つかりません | Tora Road",
    };
  }

  const titleText =
    stripHtml(post.title.rendered);

  const description =
    createDescription(post);

  const featuredImageSource =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  const featuredImage =
    toCloudFrontUrl(featuredImageSource);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const articleUrl =
    `${siteUrl}/travel/${post.slug}`;

  return {
    title: `${titleText} | Tora Road`,
    description,

    alternates: {
      canonical: articleUrl,
    },

    openGraph: {
      type: "article",
      locale: "ja_JP",
      siteName: "Tora Road",
      title: `${titleText} | Tora Road`,
      description,
      url: articleUrl,
      images: featuredImage
        ? [
            {
              url: featuredImage,
              alt:
                post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ||
                titleText,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: `${titleText} | Tora Road`,
      description,
      images: featuredImage
        ? [featuredImage]
        : undefined,
    },
  };
}

export default async function TravelPostPage({
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
            <div className="mb-5 flex flex-wrap items-center gap-4 text-xs font-semibold tracking-[0.18em]">
              <span className="rounded-full border border-white/50 px-4 py-2">
                TRAVEL
              </span>

              {post.meta?.country && (
                <span className="text-white/80">
                  {post.meta.country}
                </span>
              )}

              {post.meta?.city && (
                <span className="text-white/80">
                  {post.meta.city}
                </span>
              )}

              <span className="text-white/70">
                {formatJournalDate(post)}
              </span>

              <ViewCounter postId={post.slug} />
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
        {/* TRAVEL DATA */}
        <section className="mb-16">
          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
            TRAVEL DATA
          </p>

          <div className="grid overflow-hidden rounded-2xl border border-black/10 bg-white sm:grid-cols-2">
            <div className="border-b border-black/10 p-6 sm:border-r">
              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                COUNTRY
              </p>

              <p className="mt-3 text-xl font-bold">
                {post.meta?.country || "-"}
              </p>
            </div>

            <div className="border-b border-black/10 p-6">
              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                CITY
              </p>

              <p className="mt-3 text-xl font-bold">
                {post.meta?.city || "-"}
              </p>
            </div>

            <div className="border-b border-black/10 p-6 sm:border-r">
              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                STAY
              </p>

              <p className="mt-3 text-xl font-bold">
                {post.meta?.hotel || "-"}
              </p>
            </div>

            <div className="border-b border-black/10 p-6">
              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                TRANSPORT
              </p>

              <p className="mt-3 text-xl font-bold">
                {getTransportLabel(
                  post.meta?.transport_type
                )}
              </p>

              {post.meta?.transport_detail && (
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {post.meta.transport_detail}
                </p>
              )}
            </div>

            <div className="p-6 sm:col-span-2">
              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                EVENT / PURPOSE
              </p>

              <p className="mt-3 text-xl font-bold">
                {post.meta?.event || "-"}
              </p>
            </div>
          </div>
        </section>

        {/* ROUTE MAP */}
        {mapEmbedUrl && (
          <section className="mb-16">
            <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
              MAP
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
            href="/travel"
            className="group inline-flex items-center gap-3 text-sm font-bold tracking-[0.15em]"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>

            BACK TO TRAVEL
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
              MOTORCYCLE & TRAVEL JOURNAL
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