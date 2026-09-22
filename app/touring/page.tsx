import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";

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

  meta?: {
    journal_type?: string;
    journal_date?: string;
    distance?: string;
    hotel?: string;
    road?: string;
    food?: string;
  };

  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
};

function toCloudFrontUrl(url?: string) {
  if (!url) {
    return undefined;
  }

  return url.replace(
    /^https?:\/\/[^/]+\/wp-content\/uploads\//,
    "https://d3fqb2te8bdvc5.cloudfront.net/wp-content/uploads/"
  );
}

function getDisplayDate(post: Post) {
  return post.meta?.journal_date || post.date;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function getTouringPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/posts?_embed&per_page=100`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch touring posts");
  }

  const posts: Post[] = await res.json();

  return posts.filter((post) => {
    const journalType =
      post.meta?.journal_type || "touring";

    return journalType === "touring";
  });
}

export default async function TouringPage() {
  const posts = await getTouringPosts();

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

        <div className="mb-14">

          <p className="text-xs font-bold tracking-[0.3em] text-neutral-500">
            MOTORCYCLE JOURNAL
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            TOURING
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600">
            バイクで走った道、景色、宿、食事を記録するツーリングジャーナル。
          </p>

        </div>

        {posts.length === 0 ? (

          <div className="rounded-3xl border border-black/10 bg-white p-10">

            <p className="text-sm font-bold tracking-[0.15em] text-neutral-500">
              NO TOURING JOURNALS YET
            </p>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2">

            {posts.map((post) => {

              const imageSource =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

              const image =
                toCloudFrontUrl(imageSource);

              const alt =
                post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "";

              return (
                <Link
                  key={post.id}
                  href={`/touring/${post.slug}`}
                  className="group overflow-hidden rounded-[28px] border border-black/10 bg-white"
                >

                  <div className="overflow-hidden bg-neutral-200">

                    {image ? (
                      <img
                        src={image}
                        alt={alt}
                        className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="h-72 bg-neutral-200" />
                    )}

                  </div>

                  <div className="p-7">

                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.15em] text-neutral-500">

                      <span>TOURING</span>

                      <span>•</span>

                      <span>
                        {formatDate(
                          getDisplayDate(post)
                        )}
                      </span>

                    </div>

                    <h2
                      className="mt-5 text-2xl font-bold leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: post.title.rendered,
                      }}
                    />

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-neutral-600">
                      {stripHtml(post.excerpt.rendered)}
                    </p>

                    {(post.meta?.road ||
                      post.meta?.hotel ||
                      post.meta?.distance) && (

                      <div className="mt-6 border-t border-black/10 pt-5 text-sm text-neutral-500">

                        {post.meta?.road && (
                          <p>
                            ROAD: {post.meta.road}
                          </p>
                        )}

                        {post.meta?.distance && (
                          <p className="mt-1">
                            DISTANCE: {post.meta.distance}
                          </p>
                        )}

                        {post.meta?.hotel && (
                          <p className="mt-1">
                            STAY: {post.meta.hotel}
                          </p>
                        )}

                      </div>

                    )}

                  </div>

                </Link>
              );
            })}

          </div>

        )}

      </section>

    </main>
  );
}