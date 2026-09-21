import type { MetadataRoute } from "next";

type WordPressPost = {
  slug: string;
  modified: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const wordpressUrl =
    process.env.WORDPRESS_API_URL;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/area`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/map`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/dormy-inn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  if (!wordpressUrl) {
    return staticPages;
  }

  try {
    const res = await fetch(
      `${wordpressUrl}/posts?per_page=100`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return staticPages;
    }

    const posts: WordPressPost[] =
      await res.json();

    const postPages: MetadataRoute.Sitemap =
      posts.map((post) => ({
        url: `${siteUrl}/touring/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: "monthly",
        priority: 0.7,
      }));

    return [
      ...staticPages,
      ...postPages,
    ];
  } catch {
    return staticPages;
  }
}