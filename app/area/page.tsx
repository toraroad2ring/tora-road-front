import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";

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
    throw new Error("Failed to fetch categories");
  }

  const categories: Category[] = await res.json();

  return categories
    .filter((category) => category.count > 0)
    .filter((category) => category.slug !== "uncategorized");
}

export default async function AreaIndexPage() {
  const categories = await getCategories();

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

          <div className="grid gap-5 md:grid-cols-2">

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/area/${category.slug}`}
                className="group"
              >

                <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#f5f5f2] px-6 py-8 transition hover:bg-neutral-900 hover:text-white md:px-8">

                  <div>

                    <p className="text-xs font-bold tracking-[0.25em] text-neutral-400">
                      AREA
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                      {category.name}
                    </h2>

                    <p className="mt-3 text-sm text-neutral-500 group-hover:text-neutral-400">
                      {category.count} RIDES
                    </p>

                  </div>

                  <span className="text-3xl transition-transform group-hover:translate-x-2">
                    →
                  </span>

                </div>

              </Link>
            ))}

          </div>

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