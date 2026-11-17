// サイトマップ（/sitemap.xml。仕様: docs/site.md の「サイトマップ」）
// 固定ページを並べる。ページを足したら entries にも足す
import type { APIRoute } from "astro";
import { CONTACT } from "@constants/index.ts";
export const prerender = true;

type Entry = { path: string; lastmod?: string };

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://www.example.com/");

  // 載せないページ: 404、お問い合わせの送信完了
  const entries: Entry[] = [
    { path: "/" },
    { path: "/operator/" },
    { path: "/privacy-policy/" },
    { path: CONTACT.path },
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((entry) =>
      [
        "  <url>",
        // 日本語の URL は、エンコードした形で載せる
        `    <loc>${escapeXml(new URL(entry.path, base).href)}</loc>`,
        ...(entry.lastmod
          ? [`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`]
          : []),
        "  </url>",
      ].join("\n")
    ),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
