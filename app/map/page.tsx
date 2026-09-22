import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import JapanMap from "@/components/JapanMap";

type Term = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

type Post = {
  id: number;

  meta?: {
    journal_type?: string;
  };

  _embedded?: {
    "wp:term"?: Term[][];
  };
};

type Area = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

function getJournalType(post: Post) {
  if (post.meta?.journal_type === "travel") {
    return "travel";
  }

  return "touring";
}

function getCategory(post: Post) {
  const terms =
    post._embedded?.["wp:term"]?.flat() ?? [];

  return terms.find(
    (term) =>
      term.taxonomy === "category" &&
      term.slug !== "uncategorized"
  );
}

async function getTouringData() {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/posts?_embed&per_page=100`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch touring posts"
    );
  }

  const posts: Post[] =
    await res.json();

  /*
   * MAPはTOURING専用。
   * TRAVEL記事は除外する。
   */
  const touringPosts =
    posts.filter(
      (post) =>
        getJournalType(post) === "touring"
    );

  /*
   * TOURING記事のカテゴリを集計。
   */
  const areaMap =
    new Map<string, Area>();

  for (const post of touringPosts) {
    const category =
      getCategory(post);

    if (!category) {
      continue;
    }

    const existing =
      areaMap.get(category.slug);

    if (existing) {
      existing.count += 1;
      continue;
    }

    areaMap.set(
      category.slug,
      {
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: 1,
      }
    );
  }

  const areas =
    Array.from(areaMap.values());

  return {
    touringPosts,
    areas,
  };
}

export default async function MapPage() {
  const {
    touringPosts,
    areas,
  } = await getTouringData();

  const mapAreas =
    areas.map((area) => ({
      name: area.name,
      slug: area.slug,
    }));

  const visitedAreaCount =
    areas.length;

  const totalRides =
    touringPosts.length;

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />


      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

        <p className="mb-4 text-xs font-bold tracking-[0.35em] text-neutral-500">
          RIDE MAP
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Japan Touring Map
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
          バイクで走った地域を、
          日本地図に残していく。
        </p>

      </section>


      {/* STATS */}
      <section className="border-y border-black/10 bg-white">

        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2 md:px-10">

          <div>

            <p className="text-xs font-bold tracking-[0.3em] text-neutral-400">
              VISITED AREAS
            </p>

            <p className="mt-3 text-6xl font-black">
              {visitedAreaCount}
            </p>

          </div>


          <div>

            <p className="text-xs font-bold tracking-[0.3em] text-neutral-400">
              TOTAL RIDES
            </p>

            <p className="mt-3 text-6xl font-black">
              {totalRides}
            </p>

          </div>

        </div>

      </section>


      {/* MAP */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        <div className="mb-10">

          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
            JAPAN
          </p>

          <h2 className="text-3xl font-bold md:text-5xl">
            Visited Areas
          </h2>

        </div>


        {mapAreas.length > 0 ? (

          <div className="rounded-[28px] border border-black/10 bg-white p-6 md:p-12">

            <JapanMap
              areas={mapAreas}
            />

          </div>

        ) : (

          <div className="rounded-[28px] border border-black/10 bg-white p-10">

            <p className="text-neutral-500">
              ツーリング地域はまだ登録されていません。
            </p>

          </div>

        )}

      </section>


      {/* BACK */}
      <section className="border-t border-black/10">

        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">

          <Link
            href="/touring"
            className="inline-flex items-center gap-3 text-sm font-bold tracking-[0.15em]"
          >
            ← BACK TO TOURING
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