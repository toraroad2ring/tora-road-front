import { dormyInns } from "@/data/dormyInns";

type WordPressPost = {
  slug: string;
  meta?: {
    hotel?: string;
    visited?: boolean;
  };
};

export type DormyInnStatus = {
  name: string;
  area: string;
  visited: boolean;
  articleSlug?: string;
};

async function getWordPressPosts(): Promise<WordPressPost[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/posts?per_page=100`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch WordPress posts");
  }

  return res.json();
}

export async function getDormyInnStatuses(): Promise<DormyInnStatus[]> {
  const posts = await getWordPressPosts();

  return dormyInns.map((hotel) => {
    const matchingPost = posts.find((post) => {
      return post.meta?.hotel === hotel.name;
    });

    return {
      name: hotel.name,
      area: hotel.area,
      visited: matchingPost?.meta?.visited === true,
      articleSlug:
        matchingPost?.meta?.visited === true
          ? matchingPost.slug
          : undefined,
    };
  });
}

export async function getDormyInnProgress() {
  const hotels = await getDormyInnStatuses();

  const visitedCount =
    hotels.filter((hotel) => hotel.visited).length;

  const totalCount = hotels.length;

  const progress =
    totalCount === 0
      ? 0
      : Math.round((visitedCount / totalCount) * 100);

  return {
    hotels,
    visitedCount,
    totalCount,
    progress,
  };
}