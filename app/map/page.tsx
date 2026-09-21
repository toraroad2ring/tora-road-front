import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import JapanMap from "@/components/JapanMap";

type Category = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/categories?per_page=100`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch categories"
    );
  }

  const categories: Category[] =
    await res.json();

  return categories
    .filter(
      (category) =>
        category.count > 0
    )
    .filter(
      (category) =>
        category.slug !==
        "uncategorized"
    );
}

export default async function MapPage() {
  const categories =
    await getCategories();

  const totalRides =
    categories.reduce(
      (sum, category) =>
        sum + category.count,
      0
    );

  const areas =
    categories.map((category) => ({
      name: category.name,
      slug: category.slug,
    }));

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

        <p className="mb-4 text-xs font-bold tracking-[0.35em] text-neutral-500">
          RIDE MAP
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Japan Touring Map
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
          走った地域を、
          日本地図に残していく。
        </p>

      </section>

      <section className="border-y border-black/10 bg-white">

        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2 md:px-10">

          <div>

            <p className="text-xs font-bold tracking-[0.3em] text-neutral-400">
              VISITED AREAS
            </p>

            <p className="mt-3 text-6xl font-black">
              {categories.length}
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

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        <div className="mb-10">

          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
            JAPAN
          </p>

          <h2 className="text-3xl font-bold md:text-5xl">
            Visited Areas
          </h2>

        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6 md:p-12">

          <JapanMap areas={areas} />

        </div>

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