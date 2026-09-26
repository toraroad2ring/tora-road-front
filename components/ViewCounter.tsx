"use client";

import { useEffect, useState } from "react";

type Props = {
  postId: string;
};

type ViewResponse = {
  postId: string;
  views: number;
};

export default function ViewCounter({ postId }: Props) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const incrementView = async () => {
      try {
        const response = await fetch(
          `https://o47ml2jkj1.execute-api.ap-northeast-1.amazonaws.com/views/${encodeURIComponent(postId)}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error(`View API returned ${response.status}`);
        }

        const data: ViewResponse = await response.json();

        setViews(data.views);
      } catch (error) {
        console.error("Failed to update view count:", error);
      }
    };

    incrementView();
  }, [postId]);

  if (views === null) {
    return null;
  }

  return (
    <span className="text-white/70">
      {views.toLocaleString()} VIEWS
    </span>
  );
}