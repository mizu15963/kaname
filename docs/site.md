# サイト全体

ページは Astro でビルド時に作り、Cloudflare Workers で配信するサイトです。ページの本文は各ページのファイルに書きます。microCMS はお問い合わせの保存（`contacts`）にだけ使います（記事・カテゴリは今回の要件にないため作らない）。本番のドメインは `astro.config.mjs` の `site`（TODO: 決まったら差し替える）。

## URL

- すべてのページの URL は末尾に `/` を付ける（`astro.config.mjs` の `trailingSlash: "always"`）。`/sample` で開くと `/sample/` に転送される。
- canonical・OGP の URL は、どこで開いても本番のドメイン（`astro.config.mjs` の `site`）を指す。

## ページ構成

お問い合わせフォーム（`/contact/`）以外のすべてのページをビルド時に作ります。お問い合わせフォームだけは、送信を受け取るためアクセス時に作ります（[contact.md](contact.md)）。

| URL | ページ | ファイル |
|---|---|---|
| `/` | TOP | `src/pages/index.astro` |
| `/operator/` | 運営者情報 | `src/pages/operator.astro` |
| `/privacy-policy/` | プライバシーポリシー | `src/pages/privacy-policy.astro` |
| `/contact/` `/contact/thanks/` | お問い合わせフォーム・送信完了 | `src/pages/contact/`（[contact.md](contact.md)） |
| `/sitemap.xml` | サイトマップ | `src/pages/sitemap.xml.ts` |
| `/robots.txt` | robots.txt | `src/pages/robots.txt.ts` |

## TOP

- 上から、キャッチコピー（`SITE.catchphrase`）とお問い合わせへのボタン、サイトについて（運営者情報へのリンク）、よくある質問（開閉式）。TODO(仕様): 構成が決まったら差し替える。
- 動き（画面に入ったら出す・マーカー・ホバー）は [design.md](design.md) の「動き」。
- サイト名で検索したときに TOP が上に出るよう、タイトルはサイト名だけにし、キャッチコピーのすぐ下の文を「（サイト名）は、〜」で始める。

## 運営者情報

- 運営者・サイトについて・注意事項。表の「お問い合わせ」はお問い合わせフォームへのリンク。

## プライバシーポリシー

- URL は `/privacy-policy/`。フッターの「サイトについて」からリンクする。
- 項目は、個人情報の利用目的・管理（お問い合わせは microCMS に保存）・第三者への提供・開示などの請求・アクセス解析（GA4）・広告（アフィリエイトと Cookie）・ポリシーの変更・お問い合わせ窓口。
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

- GA4 の測定ID を `src/constants/index.ts` の `ANALYTICS.ga4MeasurementId` に入れる（空にすると計測しない）。
- 本番のドメインで開いたときだけ計測する（手元の確認や workers.dev のアクセスを混ぜないため）。
- Search Console はドメインプロパティを作り、DNS の TXT で所有権を確認する。公開後にサイトマップを送信する。
