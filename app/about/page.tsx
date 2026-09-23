import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">

      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

        <p className="mb-4 text-xs font-bold tracking-[0.35em] text-neutral-500">
          ABOUT
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          About Tora Road
        </h1>

        <p className="mt-8 max-w-3xl text-xl font-semibold leading-9 md:text-2xl md:leading-10">
          走る旅も、
          <br />
          それ以外の旅も。
        </p>

      </section>


      {/* INTRO */}
      <section className="border-y border-black/10 bg-white">

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1fr_2fr] md:px-10 md:py-28">

          <div>

            <p className="text-xs font-bold tracking-[0.3em] text-neutral-500">
              TORA ROAD
            </p>

          </div>


          <div className="max-w-3xl">

            <p className="text-2xl font-bold leading-relaxed md:text-4xl md:leading-snug">
              旅そのものより、
              <br />
              旅の途中にあるものを残したい。
            </p>

            <div className="mt-10 space-y-6 text-base leading-8 text-neutral-600">

              <p>
                Tora Roadは、
                バイクツーリングや旅行の記録を残すための個人サイトです。
              </p>

              <p>
                走って気持ちいい道や景色、
                宿、食事、旅先で立ち寄った場所。
                そういった旅の途中にあるものを、
                写真や文章と一緒に記録しています。
              </p>

              <p>
                バイクで走る旅が中心ですが、
                飛行機や鉄道で出かける旅、
                海外旅行やイベント参加なども記録しています。
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* STYLE */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        <div className="mb-12">

          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-neutral-500">
            TRAVEL STYLE
          </p>

          <h2 className="text-3xl font-bold md:text-5xl">
            How I Travel
          </h2>

        </div>


        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-[28px] border border-black/10 bg-white p-8 md:p-10">

            <p className="text-xs font-bold tracking-[0.25em] text-neutral-400">
              01
            </p>

            <h3 className="mt-4 text-2xl font-bold">
              道を楽しむ
            </h3>

            <p className="mt-5 leading-8 text-neutral-600">
              観光地をたくさん巡るより、
              景色がよく、走っていて気持ちいい道を楽しむことを重視しています。
            </p>

          </div>


          <div className="rounded-[28px] border border-black/10 bg-white p-8 md:p-10">

            <p className="text-xs font-bold tracking-[0.25em] text-neutral-400">
              02
            </p>

            <h3 className="mt-4 text-2xl font-bold">
              無理をしない
            </h3>

            <p className="mt-5 leading-8 text-neutral-600">
              細い道や急な坂道、
              ヘアピンが続くルートはなるべく避け、
              走りやすい道を選ぶようにしています。
            </p>

          </div>


          <div className="rounded-[28px] border border-black/10 bg-white p-8 md:p-10">

            <p className="text-xs font-bold tracking-[0.25em] text-neutral-400">
              03
            </p>

            <h3 className="mt-4 text-2xl font-bold">
              宿も旅の一部
            </h3>

            <p className="mt-5 leading-8 text-neutral-600">
              宿泊する旅では、
              大浴場や朝食、バイクの駐車環境なども記録しています。
              宿そのものも旅の楽しみのひとつです。
            </p>

          </div>


          <div className="rounded-[28px] border border-black/10 bg-white p-8 md:p-10">

            <p className="text-xs font-bold tracking-[0.25em] text-neutral-400">
              04
            </p>

            <h3 className="mt-4 text-2xl font-bold">
              写真と記録を残す
            </h3>

            <p className="mt-5 leading-8 text-neutral-600">
              後から旅を振り返れるように、
              道、景色、立ち寄った場所を写真と一緒に残していきます。
            </p>

          </div>

        </div>

      </section>


      {/* PROFILE */}
      <section className="border-y border-black/10 bg-white">

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1fr_2fr] md:px-10 md:py-28">

          <div>

            <p className="text-xs font-bold tracking-[0.3em] text-neutral-500">
              ABOUT THE WRITER
            </p>

          </div>


          <div className="max-w-3xl">

            <h2 className="text-3xl font-bold md:text-5xl">
              Who writes Tora Road
            </h2>

            <div className="mt-10 space-y-6 text-base leading-8 text-neutral-600">

              <p>
                千葉を拠点に、
                バイクや旅行を楽しんでいる会社員です。
                普段はIT関係の仕事をしています。
              </p>

              <p>
                ぼっちライダーなので観光地をじっくり巡るよりも、
                道や景色を楽しみながら移動する旅が好きです。
              </p>

              <p>
                海外では遺跡や歴史を感じる場所、
                国内では景色のいい道や、
                宿そのものを楽しめる旅に惹かれます。
              </p>

            </div>


            {/* BIKE */}
            <div className="mt-12 rounded-[28px] border border-black/10 bg-[#f5f5f2] p-7 md:p-8">

              <p className="text-xs font-bold tracking-[0.3em] text-neutral-400">
                CURRENT BIKE
              </p>

              <p className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
                TRIUMPH SPEED TWIN 900
              </p>

              <p className="mt-4 leading-7 text-neutral-600">
                愛車はトライアンフ スピードツイン900。
                このバイクで、景色のいい道や各地の宿を巡っています。
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* WHAT I RECORD */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">

          <div>

            <p className="text-xs font-bold tracking-[0.3em] text-neutral-500">
              WHAT I RECORD
            </p>

          </div>


          <div className="max-w-3xl">

            <h2 className="text-3xl font-bold md:text-5xl">
              What stays in the journal
            </h2>

            <div className="mt-10 space-y-6 text-base leading-8 text-neutral-600">

              <p>
                このサイトでは、
                旅先そのものだけでなく、
                そこへ向かう道や距離も含めて記録しています。
              </p>

              <p>
                景色の良かった道、
                立ち寄った場所、
                宿や食事、
                実際に行ってみて感じたことを、
                できるだけそのまま残していきます。
              </p>

              <p>
                誰かの旅の参考になればうれしいですが、
                まずは自分自身が後から振り返れる記録であることを大切にしています。
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* LINKS */}
      <section className="border-t border-black/10 bg-neutral-950 text-white">

        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">

          <p className="text-xs font-bold tracking-[0.3em] text-neutral-500">
            EXPLORE
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">

            <Link
              href="/touring"
              className="group rounded-2xl border border-white/15 p-6 transition hover:bg-white hover:text-black"
            >
              <p className="text-xs font-bold tracking-[0.2em] text-neutral-500">
                MOTORCYCLE
              </p>

              <p className="mt-3 text-2xl font-bold">
                TOURING
              </p>

              <p className="mt-6 text-sm">
                VIEW JOURNALS →
              </p>
            </Link>


            <Link
              href="/travel"
              className="group rounded-2xl border border-white/15 p-6 transition hover:bg-white hover:text-black"
            >
              <p className="text-xs font-bold tracking-[0.2em] text-neutral-500">
                TRAVEL
              </p>

              <p className="mt-3 text-2xl font-bold">
                TRAVEL
              </p>

              <p className="mt-6 text-sm">
                VIEW JOURNALS →
              </p>
            </Link>


            <Link
              href="/stays"
              className="group rounded-2xl border border-white/15 p-6 transition hover:bg-white hover:text-black"
            >
              <p className="text-xs font-bold tracking-[0.2em] text-neutral-500">
                PLACES
              </p>

              <p className="mt-3 text-2xl font-bold">
                STAYS
              </p>

              <p className="mt-6 text-sm">
                VIEW STAYS →
              </p>
            </Link>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-neutral-950 text-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-white/10 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-10">

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