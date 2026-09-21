"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Area = {
  name: string;
  slug: string;
};

type JapanMapProps = {
  areas: Area[];
};

const prefectureCodes: Record<string, string> = {
  hokkaido: "01",
  aomori: "02",
  iwate: "03",
  miyagi: "04",
  akita: "05",
  yamagata: "06",
  fukushima: "07",
  ibaraki: "08",
  tochigi: "09",
  gunma: "10",
  saitama: "11",
  chiba: "12",
  tokyo: "13",
  kanagawa: "14",
  niigata: "15",
  toyama: "16",
  ishikawa: "17",
  fukui: "18",
  yamanashi: "19",
  nagano: "20",
  gifu: "21",
  shizuoka: "22",
  aichi: "23",
  mie: "24",
  shiga: "25",
  kyoto: "26",
  osaka: "27",
  hyogo: "28",
  nara: "29",
  wakayama: "30",
  tottori: "31",
  shimane: "32",
  okayama: "33",
  hiroshima: "34",
  yamaguchi: "35",
  tokushima: "36",
  kagawa: "37",
  ehime: "38",
  kochi: "39",
  fukuoka: "40",
  saga: "41",
  nagasaki: "42",
  kumamoto: "43",
  oita: "44",
  miyazaki: "45",
  kagoshima: "46",
  okinawa: "47",
};

export default function JapanMap({
  areas,
}: JapanMapProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [loaded, setLoaded] =
    useState(false);

  useEffect(() => {
    async function loadMap() {
      const res = await fetch("/maps/japan.svg");

      if (!res.ok) {
        return;
      }

      const svgText = await res.text();

      if (!containerRef.current) {
        return;
      }

      containerRef.current.innerHTML =
        svgText;

      const svg =
        containerRef.current.querySelector("svg");

      if (svg) {
        svg.style.width = "100%";
        svg.style.height = "auto";
        svg.style.maxHeight = "720px";
      }

      const prefectures =
        containerRef.current.querySelectorAll(
          "[data-code]"
        );

      prefectures.forEach((element) => {
        const item =
          element as SVGElement;

        item.style.fill = "#e5e5e5";
        item.style.stroke = "#ffffff";
        item.style.strokeWidth = "1";
        item.style.transition = "fill 0.2s";
      });

      areas.forEach((area) => {
        const code =
          prefectureCodes[area.slug];

        if (!code) {
          return;
        }

        const prefecture =
          containerRef.current?.querySelector(
            `[data-code="${code}"]`
          ) as SVGElement | null;

        if (!prefecture) {
          return;
        }

        prefecture.style.fill = "#171717";
        prefecture.style.cursor = "pointer";

        prefecture.addEventListener(
          "mouseenter",
          () => {
            prefecture.style.fill =
              "#525252";
          }
        );

        prefecture.addEventListener(
          "mouseleave",
          () => {
            prefecture.style.fill =
              "#171717";
          }
        );

        prefecture.addEventListener(
          "click",
          () => {
            router.push(
              `/area/${area.slug}`
            );
          }
        );
      });

      setLoaded(true);
    }

    loadMap();
  }, [areas, router]);

  return (
    <div>

      {!loaded && (
        <div className="flex min-h-[400px] items-center justify-center text-sm text-neutral-400">
          Loading map...
        </div>
      )}

      <div
        ref={containerRef}
        className={
          loaded
            ? "mx-auto max-w-4xl"
            : "hidden"
        }
      />

      <div className="mt-8 flex items-center gap-6 text-xs font-semibold tracking-[0.1em] text-neutral-500">

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-sm bg-neutral-900" />
          VISITED
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-sm bg-neutral-200" />
          NOT YET
        </div>

      </div>

    </div>
  );
}