import Link from "next/link";

type Post = {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
};

async function getPost(id: string): Promise<Post> {
const res = await fetch(
  `${process.env.WORDPRESS_API_URL}/posts/${id}?_embed`,
  {
    cache: "no-store",
  }
);

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  const altText =
    post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "";

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-block mb-8 text-sm hover:underline"
      >
        ← 記事一覧へ戻る
      </Link>

      <article>
        {featuredImage && (
          <img
            src={featuredImage}
            alt={altText}
            className="w-full max-h-[520px] object-cover rounded-2xl mb-8"
          />
        )}

        <p className="text-sm text-gray-500 mb-3">
          {new Date(post.date).toLocaleDateString("ja-JP")}
        </p>

        <h1
          className="text-4xl font-bold leading-tight mb-10"
          dangerouslySetInnerHTML={{
            __html: post.title.rendered,
          }}
        />

        <div
          className="
            text-[17px]
            leading-8
            [&_p]:mb-6
            [&_h2]:text-2xl
            [&_h2]:font-bold
            [&_h2]:mt-12
            [&_h2]:mb-5
            [&_h3]:text-xl
            [&_h3]:font-bold
            [&_h3]:mt-8
            [&_h3]:mb-4
            [&_img]:rounded-xl
            [&_img]:my-8
            [&_a]:underline
          "
          dangerouslySetInnerHTML={{
            __html: post.content.rendered,
          }}
        />
      </article>
    </main>
  );
}