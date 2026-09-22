import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import { getDormyInnProgress } from "@/lib/dormyInn";
import {
  formatJournalDate,
  getJournalStartDate,
} from "@/lib/journalDate";

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

  meta?: {
    journal_type?: string;

    journal_date?: string;
    journal_start_date?: string;
    journal_end_date?: string;

    distance?: string;
    hotel?: string;
    road?: string;
    food?: string;

    country?: string;
    city?: string;
    event?: string;
    transport_type?: string;
    transport_detail?: string;
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
  if (!url) {
    return undefined;
  }

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
  const terms =
    post._embedded?.["wp:term"]?.flat() ?? [];

  return (
    terms.find(
      (term) => term.taxonomy === "category"
    ) ?? {
      id: 0,
      name: "TOURING",
      slug: "",
      taxonomy: "category",
    }
  );
}

function getJournalType(post: Post) {
  if (post.meta?.journal_type === "travel") {
    return "travel";
  }

  return "touring";
}

function getJournalLabel(post: Post) {
  return getJournalType(post) === "travel"
    ? "TRAVEL"
    : "TOURING";
}

function getPostHref(post: Post) {
  const type = getJournalType(post);

  return `/${type}/${post.slug}`;
}

function getPostContext(post: Post) {
  if (getJournalType(post) === "travel") {
    if (post.meta?.city) {
      return post.meta.city;
    }

    if (post.meta?.country) {
      return post.meta.country;
    }

    return "TRAVEL";
  }

  return getCategory(post).name;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/posts?_embed&per_page=100`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts: Post[] = await res.json();

  /*
   * 実際に旅した日の新しい順に並べる。
   *
   * 優先順位:
   * journal_start_date
   * → journal_date
   * → WordPress投稿日
   */
  return posts.sort((a, b) => {
    const dateA =
      new Date(getJournalStartDate(a)).getTime();

    const dateB =
      new Date(getJournalStartDate(b)).getTime();

    return dateB - dateA;
  });
}

export default async function Home() {
  const posts = await getPosts();

  const {
    visitedCount,
    totalCount,
  } = await getDormyInnProgress();

  /*
   * getPosts()ですでに旅した日の新しい順なので、
   * posts[0] = 最新の旅。
   */
  const latestPost = posts[0];

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      {latestPost && (() => {
        const featuredImage =
          getFeaturedImage(latestPost);

        const latestHref =
          getPostHref(latestPost);

        const journalLabel =
          getJournalLabel(latestPost);

        const context =
          getPostContext(latestPost);

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

                  <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-semibold tracking-[0.2em]">

                    <span className="rounded-full border border-white/50 px-4 py-2">
                      {journalLabel}
                    </span>

                    <span className="text-white/80">
                      {context}
                    </span>

                    <span className="text-white/70">
                      {formatJournalDate(latestPost)}
                    </span>

                  </div>

                  <Link href={latestHref}>

                    <h2
                      className="max-w-3xl text-3xl font-bold leading-tight tracking-tight transition-opacity hover:opacity-80 md:text-5xl lg:text-6xl"
                      dangerouslySetInnerHTML={{
                        __html: latestPost.title.rendered,
                      }}
                    />

                  </Link>

                  <Link
                    href={latestHref}
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
                    走る旅も、
                    <br />
                    それ以外の旅も。
                  </p>

                  <p className="mt-8 max-w-2xl text-base leading-8 text-neutral-600">
                    バイクで走った道や景色、宿、食事。
                    そして飛行機や鉄道で訪れた場所やイベント。
                    Tora Roadは、実際に旅した記録を残していくトラベルジャーナルです。
                  </p>

                </div>

              </div>

            </section>


            {/* STAYS */}
            <section className="border-t border-black/10 bg-[#f5f5f2]">

              <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

                <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:items-center">

                  <div>

                    <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
                      STAY LOG
                    </p>

                    <h2 className="text-3xl font-black leading-tight md:text-5xl">
                      PLACES
                      <br />
                      TO STAY
                    </h2>

                  </div>

                  <div>

                    <p className="max-w-2xl text-lg leading-8 text-neutral-600">
                      ブランドに縛られず、
                      大浴場やバイク駐車環境など、
                      旅で実際に使いやすい宿を記録しています。
                    </p>

                    <div className="mt-8 flex flex-wrap items-end gap-4">

                      <p className="text-6xl font-black">
                        {visitedCount}
                      </p>

                      <p className="pb-2 text-xl font-bold text-neutral-400">
                        STAYED
                      </p>

                      <p className="pb-2 text-sm font-bold text-neutral-400">
                        / {totalCount} REGISTERED
                      </p>

                    </div>

                    <Link
                      href="/stays"
                      className="group mt-8 inline-flex items-center gap-3 text-sm font-bold tracking-[0.15em]"
                    >
                      VIEW STAYS

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
                      Recent Journals
                    </h2>

                  </div>

                  <p className="hidden text-sm text-neutral-400 md:block">
                    {posts.length} STORIES
                  </p>

                </div>


                <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">

                  {posts.map((post) => {

                    const postImage =
                      getFeaturedImage(post);

                    const journalType =
                      getJournalType(post);

                    const journalLabel =
                      getJournalLabel(post);

                    const postHref =
                      getPostHref(post);

                    const category =
                      getCategory(post);

                    return (
                      <article
                        key={post.id}
                        className="group"
                      >

                        <Link href={postHref}>

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

                          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.15em] text-neutral-500">

                            <span className="rounded-full border border-black/15 px-3 py-1">
                              {journalLabel}
                            </span>

                            {journalType === "touring" ? (

                              category.slug ? (
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
                              )

                            ) : (

                              <span>
                                {post.meta?.city ||
                                  post.meta?.country ||
                                  "TRAVEL"}
                              </span>

                            )}

                            <span>/</span>

                            <span>
                              {formatJournalDate(post)}
                            </span>

                          </div>


                          <Link href={postHref}>

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
                            href={postHref}
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