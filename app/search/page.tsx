import Link from "next/link";

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
  excerpt: {
    rendered: string;
  };
  meta?: {
    hotel?: string;
    visited?: boolean;
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

  return terms.find(
    (term) => term.taxonomy === "category"
  );
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

  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    area?: string;
    hotel?: string;
    visited?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q?.trim().toLowerCase() || "";
  const area = params.area || "";
  const hotelOnly = params.hotel === "1";
  const visitedOnly = params.visited === "1";

  const posts = await getPosts();

  const filteredPosts = posts.filter((post) => {
    const category = getCategory(post);

    const titleText = post.title.rendered.toLowerCase();
    const excerptText = post.excerpt.rendered.toLowerCase();

    const matchesKeyword =
      !q ||
      titleText.includes(q) ||
      excerptText.includes(q);

    const matchesArea =
      !area ||
      category?.slug === area;

    const matchesHotel =
      !hotelOnly ||
      Boolean(post.meta?.hotel);

    const matchesVisited =
      !visitedOnly ||
      post.meta?.visited === true;

    return (
      matchesKeyword &&
      matchesArea &&
      matchesHotel &&
      matchesVisited
    );
  });

  const areas = Array.from(
    new Map(
      posts
        .map((post) => getCategory(post))
        .filter(Boolean)
        .map((category) => [
          category!.slug,
          category!,
        ])
    ).values()
  );

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

        <p className="mb-4 text-xs font-bold tracking-[0.35em] text-neutral-500">
          SEARCH
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Find a Ride
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
          キーワードや地域からツーリング記録を探す。
        </p>

      </section>

      <section className="border-y border-black/10 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

          <form className="grid gap-5 md:grid-cols-4">

            <div className="md:col-span-2">

              <label className="mb-2 block text-xs font-bold tracking-[0.2em] text-neutral-500">
                KEYWORD
              </label>

              <input
                type="text"
                name="q"
                defaultValue={params.q || ""}
                placeholder="榛名湖、絶景、ラーメン..."
                className="w-full rounded-xl border border-black/10 bg-[#f5f5f2] px-4 py-3 outline-none focus:border-black"
              />

            </div>

            <div>

              <label className="mb-2 block text-xs font-bold tracking-[0.2em] text-neutral-500">
                AREA
              </label>

              <select
                name="area"
                defaultValue={area}
                className="w-full rounded-xl border border-black/10 bg-[#f5f5f2] px-4 py-3 outline-none focus:border-black"
              >
                <option value="">
                  ALL AREAS
                </option>

                {areas.map((areaItem) => (
                  <option
                    key={areaItem.id}
                    value={areaItem.slug}
                  >
                    {areaItem.name}
                  </option>
                ))}

              </select>

            </div>

            <div className="flex items-end">

              <button
                type="submit"
                className="w-full rounded-xl bg-neutral-900 px-5 py-3 font-bold text-white transition hover:bg-neutral-700"
              >
                SEARCH
              </button>

            </div>

            <label className="flex items-center gap-2 text-sm font-medium">

              <input
                type="checkbox"
                name="hotel"
                value="1"
                defaultChecked={hotelOnly}
              />

              ホテル情報あり

            </label>

            <label className="flex items-center gap-2 text-sm font-medium">

              <input
                type="checkbox"
                name="visited"
                value="1"
                defaultChecked={visitedOnly}
              />

              訪問済み

            </label>

          </form>

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        <div className="mb-10 flex items-end justify-between">

          <div>

            <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
              RESULTS
            </p>

            <h2 className="text-3xl font-bold md:text-5xl">
              {filteredPosts.length} Rides
            </h2>

          </div>

        </div>

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">

          {filteredPosts.map((post) => {
            const featuredImage =
              getFeaturedImage(post);

            const category =
              getCategory(post);

            return (
              <article
                key={post.id}
                className="group"
              >

                <Link href={`/touring/${post.slug}`}>

                  <div className="overflow-hidden rounded-2xl bg-neutral-100">

                    {featuredImage ? (
                      <img
                        src={featuredImage}
                        alt={getAltText(post)}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="aspect-[16/10] bg-neutral-200" />
                    )}

                  </div>

                </Link>

                <div className="mt-6">

                  <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-neutral-500">
                    {category?.name || "TOURING"}
                  </p>

                  <Link href={`/touring/${post.slug}`}>

                    <h3
                      className="text-2xl font-bold leading-snug hover:opacity-60 md:text-3xl"
                      dangerouslySetInnerHTML={{
                        __html: post.title.rendered,
                      }}
                    />

                  </Link>

                  {post.meta?.hotel && (
                    <p className="mt-3 text-sm text-neutral-500">
                      HOTEL / {post.meta.hotel}
                    </p>
                  )}

                </div>

              </article>
            );
          })}

        </div>

        {filteredPosts.length === 0 && (
          <p className="text-neutral-500">
            条件に一致する記事はありません。
          </p>
        )}

      </section>

      <section className="border-t border-black/10">

        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">

          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-bold tracking-[0.15em]"
          >
            ← BACK TO JOURNAL
          </Link>

        </div>

      </section>

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