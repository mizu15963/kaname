# サイト全体

営業代行・営業支援を主軸とし、各種ツール・システム販売も行う会社のコーポレートサイトです（制作指示書: ユーザーの PC の `D:\ito_project\kaname\sheres\`）。ページは Astro でビルド時に作り、Cloudflare Workers で配信します。ページの本文は各ページのファイルに直接書きます。microCMS はお問い合わせの保存（`contacts`）にだけ使います。本番のドメインは `astro.config.mjs` の `site`（TODO: 決まったら差し替える）。

## URL

- すべてのページの URL は末尾に `/` を付ける（`astro.config.mjs` の `trailingSlash: "always"`）。`/sample` で開くと `/sample/` に転送される。
- canonical・OGP の URL は、どこで開いても本番のドメイン（`astro.config.mjs` の `site`）を指す。

## ページ構成

お問い合わせフォーム（`/contact/`）以外のすべてのページをビルド時に作ります。お問い合わせフォームだけは、送信を受け取るためアクセス時に作ります（[contact.md](contact.md)）。

| URL | ページ | ファイル |
|---|---|---|
| `/` | TOP | `src/pages/index.astro` |
| `/about/` | ABOUT（私たちについて） | `src/pages/about.astro` |
| `/service/` | SERVICE（事業内容） | `src/pages/service.astro` |
| `/company/` | COMPANY（会社概要） | `src/pages/company.astro` |
| `/privacy-policy/` | プライバシーポリシー | `src/pages/privacy-policy.astro` |
| `/contact/` `/contact/thanks/` | お問い合わせフォーム・送信完了 | `src/pages/contact/`（[contact.md](contact.md)） |
| `/sitemap.xml` | サイトマップ | `src/pages/sitemap.xml.ts` |
| `/robots.txt` | robots.txt | `src/pages/robots.txt.ts` |

## TOP

- 上から、メインビジュアル（コピー「ビジネスの可能性を、さらに先へ。」＋リード）→ ABOUT US（→ /about/）→ OUR BUSINESS（SERVICE 01・02 のカード → /service/ の各ブロック）→ CONTACT（濃紺の帯 → /contact/）。原稿は制作指示書の 03。
- `<title>` は社名だけにする（サイト名で検索したときに TOP が上に出やすい）。

## SERVICE

- SERVICE 01（`#service-01`）: 見出し・本文・主な支援領域のリスト。支援領域は実際の提供内容に合わせて公開前に確定する（`TODO(仕様)`）。
- SERVICE 02（`#service-02`）: 見出し・本文と、取扱商品（`ProductCard` 部品）。商品は `service.astro` の `products` に足すだけで並ぶ。商品の公式サイトへのリンクは別タブで開く。
- FX 自動売買ツールのリスク表示は載せない（2026-11-18 ユーザー決定）。販売・勧誘・助言の実態に合わせた法令確認は残っている（`TODO(仕様)`。制作指示書 09）。

## COMPANY

- 参考サイトの会社情報ページと同じ形の2列の表（項目名｜内容）。会社名・代表者・所在地は確定（2026-11-18）。設立・連絡先は要確認（`TODO(仕様)`）。
- 資本金は載せない（2026-11-18 ユーザー決定）。

## プライバシーポリシー

- URL は `/privacy-policy/`。フッターの「サイトについて」からリンクする。
- 項目は、個人情報の利用目的・管理（お問い合わせは microCMS に保存）・第三者への提供・開示などの請求・ポリシーの変更・お問い合わせ窓口。
- 内容を変えたら、ページの下の改定日を足す。「お問い合わせ窓口」からお問い合わせフォームへリンクする。

## プレビュー

`main` 以外のブランチは、Cloudflare がプレビュー用のアドレス（`*.workers.dev`）にデプロイします。プレビューが検索エンジンに載らないよう、次の3つで防いでいます。

1. ビルド時に Cloudflare が入れる `WORKERS_CI_BRANCH` が `main` 以外なら、全ページに `<meta name="robots" content="noindex, nofollow">` を入れる（`src/libs/env.ts`）。
2. 同じく `robots.txt` を `Disallow: /` にする。
3. `public/_headers` で、`*.workers.dev` のアドレスで開いたときは `X-Robots-Tag: noindex` を付ける（本番のビルドを workers.dev のアドレスで開いた場合も含む）。アクセス時に作るお問い合わせフォームには `_headers` が効かないため、ページの中で同じヘッダーを付ける。

手元のビルド（`WORKERS_CI_BRANCH` がない）は本番と同じ扱いです。

## サイト全体の noindex

`SITE.noindex`（`src/constants/index.ts`）を `true` にすると、`main` のビルドも含めて全ページに `<meta name="robots" content="noindex, nofollow">` が入ります。ふだんは `false` です（`true` のまま出すと、本番のサイトが検索結果から消えます）。

- いまは `true`（準備中）。**本番ドメインに切り替える前に必ず `false` にする**（[todo.md](todo.md)）。workers.dev のアドレスには「プレビュー」の3の `X-Robots-Tag: noindex` が付くので、`false` でも検索エンジンには載らない。
- 本番で noindex になるのは、404・お問い合わせの送信完了のページだけ。

## サイトマップ

- `/sitemap.xml` は固定ページを並べる（`src/pages/sitemap.xml.ts`）。ページを足したらここにも足す。送信完了のページは載せない。

## 構造化データ

- TOP: WebSite と Organization（`siteJsonLd`）。サイト名の別の書き方（`SITE.alternateNames`）とロゴ（`SITE.logo`）も入れる。
- パンくずを置いたページ: BreadcrumbList（`Breadcrumb` 部品の中で出す）。
- よくある質問を置いたページ（TOP）: FAQPage（`Faq` 部品の中で、画面に表示する質問と同じ項目から出す）。質問はページのファイルに書く。データにだけ入れて画面に出さない質問は作らない（Google のガイドライン違反になるため）。
  - Google は FAQ のリッチリザルト（検索結果で質問が開く表示）を政府・医療系の権威あるサイトに限っているため、このサイトでは表示されない見込み。検索エンジンや AI 検索がページの中身を読み取る手がかりとして入れている。

## アクセス解析

- アクセス解析ツール（GA4 など）は使わない（2026-11-18 決定）。プライバシーポリシーにも項目を置かない。
- Search Console はドメインプロパティを作り、DNS の TXT で所有権を確認する。公開後にサイトマップを送信する。
