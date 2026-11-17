# サイト全体

情報メディア型のサイトです。記事は microCMS、ページは Astro でビルド時に作り、Cloudflare Workers で配信します。本番のドメインは `astro.config.mjs` の `site`（TODO: 決まったら差し替える）。

## URL

- すべてのページの URL は末尾に `/` を付ける（`astro.config.mjs` の `trailingSlash: "always"`）。`/sample` で開くと `/sample/` に転送される。
- 記事は `/{スラッグ}/`（[article.md](article.md)）。カテゴリ名を URL に入れない（お知らせの記事も `/{スラッグ}/`）。
- canonical・OGP の URL は、どこで開いても本番のドメイン（`astro.config.mjs` の `site`）を指す。

## ページ構成

お問い合わせフォーム（`/contact/`）以外のすべてのページをビルド時に作ります。お問い合わせフォームだけは、送信を受け取るためアクセス時に作ります（[contact.md](contact.md)）。

| URL | ページ | ファイル |
|---|---|---|
| `/` | TOP | `src/pages/index.astro` |
| `/{カテゴリID}/`（いまは仮の `/sample-hub/`） | ハブページ（カテゴリの入口） | `src/pages/{id}.astro` → `src/components/HubPage.astro` |
| `/articles/` | 記事一覧 | `src/pages/articles/index.astro` |
| `/{スラッグ}/` | 記事 | `src/pages/[slug].astro` |
| `/operator/` | 運営者情報 | `src/pages/operator.astro` |
| `/privacy-policy/` | プライバシーポリシー | `src/pages/privacy-policy.astro` |
| `/contact/` `/contact/thanks/` | お問い合わせフォーム・送信完了 | `src/pages/contact/`（[contact.md](contact.md)） |
| `/sitemap.xml` | サイトマップ | `src/pages/sitemap.xml.ts` |
| `/robots.txt` | robots.txt | `src/pages/robots.txt.ts` |

- カテゴリ別・タグ別・月別の一覧ページは作らない。

## TOP

- 上から、キャッチコピー（`SITE.catchphrase`。マーカーを引く）、カテゴリから探す（ハブページへのカード）、新着記事（`BLOG.latestCount` 本）、サイトについて（運営者情報へのリンク）、よくある質問（開閉式）。
- 動き（画面に入ったら出す・マーカー・ホバー）は [design.md](design.md) の「動き」。
- サイト名で検索したときに TOP が上に出るよう、タイトルはサイト名だけにし、キャッチコピーのすぐ下の文を「（サイト名）は、〜」で始める。

## ハブページ

- `src/constants/index.ts` の `CATEGORY.hubs` にあるカテゴリごとに1ページ。URL はカテゴリのコンテンツID。
- 上から、見出し → ページ内の目次（記事・ポイント・始め方・質問へ移動するボタン）→ 導入文 → そのカテゴリの新着記事（`BLOG.latestCount` 本。いまは6本）と、続きを見る記事一覧（絞り込み済み）へのリンク → ここがポイント（3つ）→ 始めるまでの流れ→ よくある質問（開閉式）→ ほかのカテゴリ。
- 動き（見出しを画面に入ったら出す・ホバー）は [design.md](design.md) の「動き」。
- 記事を探しに来た人がスクロールせずに記事にたどり着けるよう、記事を導入文のすぐ下に置いている。
- 中身はすべて各ページのファイル（`src/pages/{カテゴリID}.astro`）に書き、`HubPage.astro` に渡す。

## 運営者情報

- 運営者・サイトについて・注意事項。表の「お問い合わせ」はお問い合わせフォームへのリンク。

## プライバシーポリシー

- URL は `/privacy-policy/`。フッターの「サイトについて」からリンクする。
- 項目は、個人情報の利用目的・管理（お問い合わせは microCMS に保存）・第三者への提供・開示などの請求・アクセス解析（GA4）・広告（アフィリエイトと Cookie）・ポリシーの変更・お問い合わせ窓口。
- 内容を変えたら、ページの下の改定日を足す。「お問い合わせ窓口」からお問い合わせフォームへリンクする。

## 記事一覧

- 全記事を `/articles/` の1ページに新しい順で並べ、カテゴリのチップで絞り込む。カテゴリごとの一覧ページは作らない。
- 絞り込んだ状態は `/articles/?category={カテゴリID}` で表す（チップを押すと URL が変わるので、そのまま共有・リンクできる）。
- 絞り込みは画面の中（JavaScript）で行う。JavaScript が動かないときは全記事を表示する。
- 記事が1本もないカテゴリのチップは出さない。

## プレビュー

`main` 以外のブランチは、Cloudflare がプレビュー用のアドレス（`*.workers.dev`）にデプロイします。プレビューが検索エンジンに載らないよう、次の3つで防いでいます。

1. ビルド時に Cloudflare が入れる `WORKERS_CI_BRANCH` が `main` 以外なら、全ページに `<meta name="robots" content="noindex, nofollow">` を入れる（`src/libs/env.ts`）。
2. 同じく `robots.txt` を `Disallow: /` にする。
3. `public/_headers` で、`*.workers.dev` のアドレスで開いたときは `X-Robots-Tag: noindex` を付ける（本番のビルドを workers.dev のアドレスで開いた場合も含む）。アクセス時に作るお問い合わせフォームには `_headers` が効かないため、ページの中で同じヘッダーを付ける。

手元のビルド（`WORKERS_CI_BRANCH` がない）は本番と同じ扱いです。

## サイト全体の noindex

`SITE.noindex`（`src/constants/index.ts`）を `true` にすると、`main` のビルドも含めて全ページに `<meta name="robots" content="noindex, nofollow">` が入ります。ふだんは `false` です（`true` のまま出すと、本番のサイトが検索結果から消えます）。

- いまは `true`（準備中）。**本番ドメインに切り替える前に必ず `false` にする**（[todo.md](todo.md)）。workers.dev のアドレスには「プレビュー」の3の `X-Robots-Tag: noindex` が付くので、`false` でも検索エンジンには載らない。
- 本番で noindex になるのは、microCMS で「検索エンジンに載せない」をオンにした記事・404・お問い合わせの送信完了のページだけ。

## サイトマップ

- `/sitemap.xml` をビルド時に microCMS から作る。載せるのは TOP・ハブページ・記事一覧・運営者情報・プライバシーポリシー・お問い合わせと、noindex でない記事（送信完了のページは載せない）。
- 記事の `lastmod` は [article.md](article.md) の更新日。
- microCMS からの取得に失敗したらビルドを止める（ページが抜けたサイトマップを公開しないため）。

## 構造化データ

- TOP: WebSite と Organization（`siteJsonLd`）。サイト名の別の書き方（`SITE.alternateNames`）とロゴ（`SITE.logo`）も入れる。
- 記事: BlogPosting（`blogPostingJsonLd`）。
- パンくずを置いたページ: BreadcrumbList（`Breadcrumb` 部品の中で出す）。
- よくある質問を置いたページ（TOP・ハブページ）: FAQPage（`Faq` 部品の中で、画面に表示する質問と同じ項目から出す）。質問はページのファイルに書く。データにだけ入れて画面に出さない質問は作らない（Google のガイドライン違反になるため）。
  - Google は FAQ のリッチリザルト（検索結果で質問が開く表示）を政府・医療系の権威あるサイトに限っているため、このサイトでは表示されない見込み。検索エンジンや AI 検索がページの中身を読み取る手がかりとして入れている。

## アクセス解析

- GA4 の測定ID を `src/constants/index.ts` の `ANALYTICS.ga4MeasurementId` に入れる（空にすると計測しない）。
- 本番のドメインで開いたときだけ計測する（手元の確認や workers.dev のアクセスを混ぜないため）。
- Search Console はドメインプロパティを作り、DNS の TXT で所有権を確認する。公開後にサイトマップを送信する。
