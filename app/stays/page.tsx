import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";

type Stay = {
  id: number;

  title: {
    rendered: string;
  };

  meta?: {
    area?: string;
    visited?: boolean;
    article_slug?: string;
    large_bath?: boolean;
    motorcycle_parking?: string;
    parking_note?: string;
  };
};

function getParkingLabel(value?: string) {
  switch (value) {
    case "good":
      return "○ バイク向け";

    case "conditional":
      return "△ 条件付き";

    case "unavailable":
      return "× 駐車不可";

    default:
      return "不明";
  }
}

async function getStays(): Promise<Stay[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/dormy_inn?per_page=100`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch stays");
  }

  return res.json();
}

export default async function StaysPage() {
  const stays = await getStays();

  const visitedCount = stays.filter(
    (stay) => stay.meta?.visited === true
  ).length;

  const largeBathCount = stays.filter(
    (stay) => stay.meta?.large_bath === true
  ).length;

  const motorcycleFriendlyCount = stays.filter(
    (stay) => stay.meta?.motorcycle_parking === "good"
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

        <div className="mb-14">

          <p className="text-xs font-bold tracking-[0.3em] text-neutral-500">
            TOURING FRIENDLY HOTELS
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            STAYS
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600">
            ブランドに縛られず、ツーリングで使いやすい宿を記録。
            大浴場やバイク駐車環境など、実際に気になる条件を残します。
          </p>

        </div>

        {/* SUMMARY */}
        <section className="mb-14 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-black/10 bg-white p-6">

            <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
              STAYED
            </p>

            <p className="mt-3 text-3xl font-black">
              {visitedCount}
            </p>

          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">

            <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
              LARGE BATH
            </p>

            <p className="mt-3 text-3xl font-black">
              {largeBathCount}
            </p>

          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">

            <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
              MOTORCYCLE FRIENDLY
            </p>

            <p className="mt-3 text-3xl font-black">
              {motorcycleFriendlyCount}
            </p>

          </div>

        </section>

        {/* STAY LIST */}
        <section>

          <div className="grid gap-6 md:grid-cols-2">

            {stays.map((stay) => {

              const visited =
                stay.meta?.visited === true;

              const articleSlug =
                stay.meta?.article_slug;

              return (
                <div
                  key={stay.id}
                  className="rounded-[28px] border border-black/10 bg-white p-7"
                >

                  <div className="flex items-start justify-between gap-5">

                    <div>

                      <p className="text-xs font-bold tracking-[0.2em] text-neutral-400">
                        {stay.meta?.area || "AREA"}
                      </p>

                      <h2
                        className="mt-3 text-2xl font-bold"
                        dangerouslySetInnerHTML={{
                          __html: stay.title.rendered,
                        }}
                      />

                    </div>

                    <span
                      className={`rounded-full px-3 py-2 text-[10px] font-bold tracking-[0.15em] ${
                        visited
                          ? "bg-black text-white"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {visited ? "STAYED" : "PLANNED"}
                    </span>

                  </div>

                  <div className="mt-7 grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-2">

                    <div>

                      <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400">
                        LARGE BATH
                      </p>

                      <p className="mt-2 font-bold">
                        {stay.meta?.large_bath
                          ? "○ あり"
                          : "－"}
                      </p>

                    </div>

                    <div>

                      <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400">
                        MOTORCYCLE
                      </p>

                      <p className="mt-2 font-bold">
                        {getParkingLabel(
                          stay.meta?.motorcycle_parking
                        )}
                      </p>

                    </div>

                  </div>

                  {stay.meta?.parking_note && (

                    <div className="mt-6 rounded-xl bg-[#f5f5f2] p-4">

                      <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400">
                        PARKING NOTE
                      </p>

                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        {stay.meta.parking_note}
                      </p>

                    </div>

                  )}

                  {articleSlug && visited && (

                    <Link
                      href={`/touring/${articleSlug}`}
                      className="mt-6 inline-flex text-xs font-bold tracking-[0.15em] underline underline-offset-4"
                    >
                      VIEW JOURNAL →
                    </Link>

                  )}

                </div>
              );
            })}

          </div>

        </section>

      </section>

    </main>
  );
}