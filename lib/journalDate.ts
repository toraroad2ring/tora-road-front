export type JournalDatePost = {
  date: string;

  meta?: {
    journal_date?: string;
    journal_start_date?: string;
    journal_end_date?: string;
  };
};

function formatSingleDate(date: string) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function getJournalStartDate(
  post: JournalDatePost
) {
  return (
    post.meta?.journal_start_date ||
    post.meta?.journal_date ||
    post.date
  );
}

export function getJournalEndDate(
  post: JournalDatePost
) {
  return post.meta?.journal_end_date;
}

export function formatJournalDate(
  post: JournalDatePost
) {
  const startDate =
    getJournalStartDate(post);

  const endDate =
    getJournalEndDate(post);

  /*
   * 終了日なし
   * 例: 2026/09/11
   */
  if (!endDate) {
    return formatSingleDate(startDate);
  }

  /*
   * 開始日と終了日が同じ
   * 例: 2026/09/11
   */
  if (startDate === endDate) {
    return formatSingleDate(startDate);
  }

  /*
   * 複数日
   * 例: 2026/08/04 - 2026/08/10
   */
  return `${formatSingleDate(startDate)} - ${formatSingleDate(endDate)}`;
}