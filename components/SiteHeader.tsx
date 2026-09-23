import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-[#f5f5f2]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">

        <Link href="/">
          <div>
            <p className="text-2xl font-black tracking-[0.18em] md:text-3xl">
              TORA ROAD
            </p>

            <p className="mt-1 text-[10px] tracking-[0.35em] text-neutral-500 md:text-xs">
              MOTORCYCLE & TRAVEL JOURNAL
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold tracking-[0.15em] text-neutral-500">

          <Link
            href="/"
            className="transition hover:text-black"
          >
            JOURNAL
          </Link>

          <Link
            href="/touring"
            className="transition hover:text-black"
          >
            TOURING
          </Link>

          <Link
            href="/travel"
            className="transition hover:text-black"
          >
            TRAVEL
          </Link>

          <Link
            href="/area"
            className="transition hover:text-black"
          >
            AREAS
          </Link>

          <Link
            href="/map"
            className="transition hover:text-black"
          >
            MAP
          </Link>

          <Link
            href="/stays"
            className="transition hover:text-black"
          >
            STAYS
          </Link>

          <Link
            href="/about"
            className="transition hover:text-black"
          >
            ABOUT
          </Link>

          <Link
            href="/search"
            className="transition hover:text-black"
          >
            SEARCH
          </Link>

        </nav>

      </div>
    </header>
  );
}