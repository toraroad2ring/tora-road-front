import Link from "next/link";

type Post = {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/posts?_embed`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-10">Tora Road</h1>

      <div className="grid gap-10">
        {posts.map((post) => {
          const featuredImageSource =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

          const featuredImage = featuredImageSource?.replace(
            "http://18.176.161.200/wp-content/uploads/",
            "https://d3fqb2te8bdvc5.cloudfront.net/wp-content/uploads/"
          );

          const altText =
            post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "";

          return (
            <article
              key={post.id}
              className="border-b pb-10"
            >
              {featuredImage && (
                <Link href={`/posts/${post.id}`}>
                  <img
                    src={featuredImage}
                    alt={altText}
                    className="w-full max-h-[420px] object-cover rounded-xl mb-5"
                  />
                </Link>
              )}

              <p className="text-sm text-gray-500 mb-2">
                {new Date(post.date).toLocaleDateString("ja-JP")}
              </p>

              <Link href={`/posts/${post.id}`}>
                <h2
                  className="text-3xl font-bold mb-3 hover:underline"
                  dangerouslySetInnerHTML={{
                    __html: post.title.rendered,
                  }}
                />
              </Link>

              <div
                className="text-lg leading-8 mb-4"
                dangerouslySetInnerHTML={{
                  __html: post.excerpt.rendered,
                }}
              />

              <Link
                href={`/posts/${post.id}`}
                className="font-medium hover:underline"
              >
                続きを読む →
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}