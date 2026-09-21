import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import { getDormyInnProgress } from "@/lib/dormyInn";

export default async function DormyInnPage() {
  const {
    hotels,
    visitedCount,
    totalCount,
    progress,
  } = await getDormyInnProgress();

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

        <p className="mb-4 text-xs font-bold tracking-[0.35em] text-neutral-500">
          PROJECT
        </p>

        <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          DORMY INN
          <br />
          TOURING PROJECT
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
          バイクで各地を走りながら、
          ドーミーインを巡っていくツーリング記録。
        </p>

      </section>

      <section className="border-y border-black/10 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">

          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-end">

            <div>

              <p className="text-xs font-bold tracking-[0.3em] text-neutral-400">
                VISITED
              </p>

              <p className="mt-3 text-6xl font-black">
                {visitedCount}

                <span className="ml-2 text-2xl text-neutral-400">
                  / {totalCount}
                </span>
              </p>

            </div>

            <div>

              <div className="flex items-center justify-between text-sm font-semibold">
                <span>PROGRESS</span>
                <span>{progress}%</span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-neutral-200">

                <div
                  className="h-full rounded-full bg-neutral-900"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        <div className="mb-10">

          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
            LIST
          </p>

          <h2 className="text-3xl font-bold md:text-5xl">
            Dormy Inn Log
          </h2>

        </div>

        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">

          {hotels.map((hotel, index) => {
            const content = (
              <div className="grid grid-cols-[70px_1fr_auto] items-center gap-4 px-6 py-6 md:grid-cols-[90px_1fr_auto] md:px-8">

                <div
                  className={`text-sm font-black ${
                    hotel.visited
                      ? "text-neutral-900"
                      : "text-neutral-300"
                  }`}
                >
                  {hotel.visited ? "✓ DONE" : "○ NEXT"}
                </div>

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-neutral-400">
                    {hotel.area}
                  </p>

                  <p className="mt-1 text-lg font-bold md:text-xl">
                    {hotel.name}
                  </p>

                </div>

                <div className="text-xl text-neutral-400">
                  {hotel.articleSlug ? "→" : ""}
                </div>

              </div>
            );

            return (
              <div
                key={hotel.name}
                className={
                  index !== hotels.length - 1
                    ? "border-b border-black/10"
                    : ""
                }
              >

                {hotel.articleSlug ? (
                  <Link
                    href={`/touring/${hotel.articleSlug}`}
                    className="block transition hover:bg-neutral-50"
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}

              </div>
            );
          })}

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