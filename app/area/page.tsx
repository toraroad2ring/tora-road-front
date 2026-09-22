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

function getCategory(post: Post) {
  const terms =
    post._embedded?.["wp:term"]?.flat() ?? [];

  return terms.find(
    (term) =>
      term.taxonomy === "category" &&
      term.slug !== "uncategorized"
  );
}

function getJournalType(post: Post) {
  if (post.meta?.journal_type === "travel") {
    return "travel";
  }

  return "touring";
}

async function getAreas(): Promise<Area[]> {
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
   * AREASはTOURING専用。
   * TRAVEL記事は集計対象から除外する。
   */
  const touringPosts = posts.filter(
    (post) =>
      getJournalType(post) === "touring"
  );

  const areaMap = new Map<
    string,
    Area
  >();

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

    areaMap.set(category.slug, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: 1,
    });
  }

  return Array.from(
    areaMap.values()
  ).sort((a, b) =>
    a.name.localeCompare(
      b.name,
      "ja"
    )
  );
}

export default async function AreaIndexPage() {
  const areas =
    await getAreas();

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

        <p className="mb-4 text-xs font-bold tracking-[0.35em] text-neutral-500">
          AREAS
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Ride by Area
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
          走った地域からツーリング記録を探す。
        </p>

      </section>


      <section className="border-t border-black/10 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

          {areas.length > 0 ? (

            <div className="grid gap-5 md:grid-cols-2">

              {areas.map((area) => (
                <Link
                  key={area.id}
                  href={`/area/${area.slug}`}
                  className="group"
                >

                  <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#f5f5f2] px-6 py-8 transition hover:bg-neutral-900 hover:text-white md:px-8">

                    <div>

                      <p className="text-xs font-bold tracking-[0.25em] text-neutral-400">
                        AREA
                      </p>

                      <h2 className="mt-2 text-3xl font-black">
                        {area.name}
                      </h2>

                      <p className="mt-3 text-sm text-neutral-500 group-hover:text-neutral-400">
                        {area.count} RIDES
                      </p>

                    </div>

                    <span className="text-3xl transition-transform group-hover:translate-x-2">
                      →
                    </span>

                  </div>

                </Link>
              ))}

            </div>

          ) : (

            <p className="text-neutral-500">
              ツーリング地域はまだ登録されていません。
            </p>

          )}

        </div>

      </section>


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