import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import { getDormyInnProgress } from "@/lib/dormyInn";

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
  excerpt: {
    rendered: string;
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

function getCategory(post: Post) {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];

  return (
    terms.find((term) => term.taxonomy === "category") ?? {
      id: 0,
      name: "TOURING",
      slug: "",
      taxonomy: "category",
    }
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/posts?_embed`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  const {
    visitedCount,
    totalCount,
    progress,
  } = await getDormyInnProgress();

  const latestPost = posts[0];

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      {latestPost && (() => {
        const latestCategory = getCategory(latestPost);
        const featuredImage = getFeaturedImage(latestPost);

        return (
          <>

            {/* HERO */}
            <section className="mx-auto max-w-7xl px-6 pt-8 md:px-10 md:pt-12">

              <div className="relative overflow-hidden rounded-[28px] bg-neutral-900">

                {featuredImage ? (
                  <img
                    src={featuredImage}
                    alt={getAltText(latestPost)}
                    className="h-[460px] w-full object-cover md:h-[620px]"
                  />
                ) : (
                  <div className="h-[460px] bg-neutral-800 md:h-[620px]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 max-w-4xl p-7 text-white md:p-12">

                  <div className="mb-4 flex items-center gap-4 text-xs font-semibold tracking-[0.2em]">

                    {latestCategory.slug ? (
                      <Link
                        href={`/area/${latestCategory.slug}`}
                        className="rounded-full border border-white/50 px-4 py-2 transition hover:bg-white hover:text-black"
                      >
                        {latestCategory.name}
                      </Link>
                    ) : (
                      <span className="rounded-full border border-white/50 px-4 py-2">
                        {latestCategory.name}
                      </span>
                    )}

                    <span className="text-white/70">
                      {formatDate(latestPost.date)}
                    </span>

                  </div>

                  <Link href={`/touring/${latestPost.slug}`}>

                    <h2
                      className="max-w-3xl text-3xl font-bold leading-tight tracking-tight transition-opacity hover:opacity-80 md:text-5xl lg:text-6xl"
                      dangerouslySetInnerHTML={{
                        __html: latestPost.title.rendered,
                      }}
                    />

                  </Link>

                  <Link
                    href={`/touring/${latestPost.slug}`}
                    className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold tracking-[0.15em]"
                  >
                    READ STORY

                    <span className="text-xl transition-transform group-hover:translate-x-2">
                      →
                    </span>
                  </Link>

                </div>

              </div>

            </section>

            {/* ABOUT */}
            <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

              <div className="grid gap-8 md:grid-cols-[1fr_2fr]">

                <p className="text-xs font-bold tracking-[0.3em] text-neutral-500">
                  ABOUT TORA ROAD
                </p>

                <div>

                  <p className="max-w-3xl text-2xl font-semibold leading-relaxed md:text-4xl md:leading-snug">
                    走ることを楽しむための、
                    <br />
                    バイクツーリング記録。
                  </p>

                  <p className="mt-8 max-w-2xl text-base leading-8 text-neutral-600">
                    景色のいい道を走り、気になった場所に立ち寄り、
                    その日のルートと風景を記録するモーターサイクルジャーナル。
                  </p>

                </div>

              </div>

            </section>

            {/* DORMY INN PROJECT */}
            <section className="border-t border-black/10 bg-[#f5f5f2]">

              <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

                <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:items-center">

                  <div>

                    <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
                      PROJECT
                    </p>

                    <h2 className="text-3xl font-black leading-tight md:text-5xl">
                      DORMY INN
                      <br />
                      TOURING PROJECT
                    </h2>

                  </div>

                  <div>

                    <p className="max-w-2xl text-lg leading-8 text-neutral-600">
                      バイクで各地を走りながら、
                      ドーミーインを巡っていくツーリング記録。
                    </p>

                    <div className="mt-8 flex items-end gap-4">

                      <p className="text-6xl font-black">
                        {visitedCount}
                      </p>

                      <p className="pb-2 text-xl font-bold text-neutral-400">
                        / {totalCount} VISITED
                      </p>

                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-neutral-200">

                      <div
                        className="h-full rounded-full bg-neutral-900"
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>

                    <Link
                      href="/dormy-inn"
                      className="group mt-8 inline-flex items-center gap-3 text-sm font-bold tracking-[0.15em]"
                    >
                      VIEW PROJECT

                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>

                    </Link>

                  </div>

                </div>

              </div>

            </section>

            {/* JOURNAL */}
            <section className="border-t border-black/10 bg-white">

              <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

                <div className="mb-12 flex items-end justify-between">

                  <div>

                    <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
                      JOURNAL
                    </p>

                    <h2 className="text-3xl font-bold md:text-5xl">
                      Recent Rides
                    </h2>

                  </div>

                  <p className="hidden text-sm text-neutral-400 md:block">
                    {posts.length} STORIES
                  </p>

                </div>

                <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">

                  {posts.map((post) => {
                    const postImage = getFeaturedImage(post);
                    const category = getCategory(post);

                    return (
                      <article
                        key={post.id}
                        className="group"
                      >

                        <Link href={`/touring/${post.slug}`}>

                          <div className="overflow-hidden rounded-2xl bg-neutral-100">

                            {postImage ? (
                              <img
                                src={postImage}
                                alt={getAltText(post)}
                                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                              />
                            ) : (
                              <div className="aspect-[16/10] bg-neutral-200" />
                            )}

                          </div>

                        </Link>

                        <div className="mt-6">

                          <div className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.15em] text-neutral-500">

                            {category.slug ? (
                              <Link
                                href={`/area/${category.slug}`}
                                className="hover:text-black hover:underline"
                              >
                                {category.name}
                              </Link>
                            ) : (
                              <span>
                                {category.name}
                              </span>
                            )}

                            <span>/</span>

                            <span>
                              {formatDate(post.date)}
                            </span>

                          </div>

                          <Link href={`/touring/${post.slug}`}>

                            <h3
                              className="text-2xl font-bold leading-snug transition-opacity hover:opacity-60 md:text-3xl"
                              dangerouslySetInnerHTML={{
                                __html: post.title.rendered,
                              }}
                            />

                            <div
                              className="mt-4 line-clamp-2 text-sm leading-7 text-neutral-500 md:text-base"
                              dangerouslySetInnerHTML={{
                                __html: post.excerpt.rendered,
                              }}
                            />

                          </Link>

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

              </div>

            </section>

          </>
        );
      })()}

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