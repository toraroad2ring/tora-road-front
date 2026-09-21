export type DormyInnStatus = {
  name: string;
  area: string;
  visited: boolean;
  articleSlug?: string;
};

type WordPressDormyInn = {
  id: number;
  title: {
    rendered: string;
  };
  meta?: {
    area?: string;
    visited?: boolean;
    article_slug?: string;
  };
};

async function getDormyInns(): Promise<WordPressDormyInn[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/dormy_inn?per_page=100`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Dormy Inn data from WordPress");
  }

  return res.json();
}

export async function getDormyInnStatuses(): Promise<DormyInnStatus[]> {
  const dormyInns = await getDormyInns();

  return dormyInns.map((hotel) => {
    return {
      name: hotel.title.rendered,
      area: hotel.meta?.area ?? "",
      visited: hotel.meta?.visited === true,
      articleSlug:
        hotel.meta?.visited === true
          ? hotel.meta?.article_slug || undefined
          : undefined,
    };
  });
}

export async function getDormyInnProgress() {
  const hotels = await getDormyInnStatuses();

  const visitedCount = hotels.filter(
    (hotel) => hotel.visited
  ).length;

  const totalCount = hotels.length;

  const progress =
    totalCount === 0
      ? 0
      : Math.round(
          (visitedCount / totalCount) * 100
        );

  return {
    hotels,
    visitedCount,
    totalCount,
    progress,
  };
}