// 表示の整形（URL・日付・画像）
import type { BlogSummary } from "@libs/microcms.ts";

// 記事の URL（/{スラッグ}/）。日本語などコンテンツIDに使えない URL にしたいときだけ urlSlug を使う（docs/microcms.md の「URL の決まり方」）
export const blogSlug = (blog: Pick<BlogSummary, "id" | "urlSlug">) =>
  blog.urlSlug?.trim() || blog.id;
export const blogPath = (blog: Pick<BlogSummary, "id" | "urlSlug">) =>
  `/${blogSlug(blog)}/`;

// 公開日・更新日
export const blogPublishedAt = (blog: BlogSummary) =>
  blog.publishedAt ?? blog.createdAt;
export const blogRevisedAt = (blog: BlogSummary) =>
  blog.revisedAt ?? blogPublishedAt(blog);

// サムネイル（16:9 に切り抜く）。microCMS の画像がなければ仮の画像
export const blogThumbnail = (blog: BlogSummary, width: number) => {
  if (blog.thumbnail?.url) {
    return `${blog.thumbnail.url}?w=${width}&h=${Math.round((width * 9) / 16)}&fit=crop&q=70`;
  }
  return "/images/noimg.svg";
};
