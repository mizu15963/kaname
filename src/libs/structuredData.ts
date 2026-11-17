// 構造化データ（JSON-LD）を作る（仕様: docs/site.md の「構造化データ」）
import { SITE } from "@constants/index.ts";

type JsonLd = Record<string, unknown>;

// パンくずの1段（url がない段は、いま見ているページ）
export type BreadcrumbItem = { name: string; url?: string };

// <script type="application/ld+json"> に入れる文字列。
// 本文に「</script>」などが入っていても HTML として壊れないよう、< > & を \uXXXX に置き換える
export const toJsonLdString = (data: JsonLd) =>
  JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

const absolute = (path: string, site: URL) => new URL(path, site).href;

// 運営者（TOP のサイト情報）。@id で TOP の運営者と同じものだと示す
const organization = (site: URL): JsonLd => ({
  "@type": "Organization",
  "@id": absolute("/#organization", site),
  name: SITE.title,
  alternateName: SITE.alternateNames,
  url: absolute("/", site),
  logo: absolute(SITE.logo, site),
});

// サイト（WebSite）と運営者（Organization）。TOP にだけ出す（Google は TOP のデータからサイト名を決めるため）
export const siteJsonLd = (site: URL): JsonLd => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": absolute("/#website", site),
      name: SITE.title,
      alternateName: SITE.alternateNames,
      url: absolute("/", site),
      description: SITE.description,
      inLanguage: "ja",
      publisher: { "@id": absolute("/#organization", site) },
    },
    organization(site),
  ],
});

// パンくず（BreadcrumbList）。画面に表示するパンくずと同じ項目から作る（Breadcrumb 部品の中で出す）
export const breadcrumbJsonLd = (
  items: BreadcrumbItem[],
  site: URL
): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.url ? { item: absolute(item.url, site) } : {}),
  })),
});
