# Cloudflare（ビルド・配信）

**Cloudflare Workers Builds** で GitHub のリポジトリとつなぎ、ビルドとデプロイを Cloudflare だけで行います（Cloudflare Pages や GitHub Actions は使いません）。
`main` にプッシュすると本番に、それ以外のブランチをプッシュするとプレビューのアドレスにデプロイされます。

お問い合わせフォーム（`/contact/`）以外はビルド時に作るため、Worker はほぼ静的ファイルを配信するだけです。お問い合わせフォームだけは Worker が送信を受け取るので、実行時の変数が要ります（[contact.md](contact.md) の「設定の手順」）。

アカウント側の操作（ログイン・GitHub 連携の許可・キーの入力）はご自身で行ってください。キーやデプロイフックの URL はチャットやリポジトリに貼らないでください。画面の表記は変わることがあります。

## 全体の流れ

```
GitHub に push ──▶ Cloudflare Workers Builds（npm run build → npx wrangler deploy）──▶ https://kaname.<アカウント>.workers.dev/
```

## 1. Worker を作って GitHub とつなぐ

1. Cloudflare ダッシュボード → **Workers & Pages** → **作成（Create）** → **リポジトリをインポート（Import a repository）**。
2. GitHub を連携し（初回は Cloudflare の GitHub アプリにリポジトリへのアクセスを許可する）、このリポジトリを選ぶ。
3. 次のように設定する。

| 項目 | 値 |
|---|---|
| プロジェクト名（Worker 名） | `kaname`（`package.json` の `name` と同じにする。違うとデプロイが失敗する。名前を変えるときは両方そろえる） |
| 本番のブランチ | `main` |
| ビルドコマンド | `npm run build` |
| デプロイコマンド | `npx wrangler deploy` |
| 本番以外のブランチのビルド | オン（デプロイコマンドは `npx wrangler versions upload`。プレビュー用のアドレスができる）。ビルド回数を節約したいときはオフ |
| ルートディレクトリ | 空（リポジトリ直下） |

## 2. ビルド用の変数を入れる

Worker の **設定（Settings）→ ビルド（Build）→ 変数とシークレット（Variables and secrets）** に入れます。ビルドは microCMS を読まないので、microCMS の変数はビルドのほうには要りません（入っていても害はありません）。

| 名前 | 種類 | 内容 |
|---|---|---|
| `NODE_VERSION` | テキスト | `24`（`package.json` の `engines.node` と同じ版） |

- 変数を入れた後、最初のビルドが失敗していたら **デプロイ（Deployments）→ 再試行（Retry build）** でやり直す。
- microCMS と Turnstile の変数は、お問い合わせフォーム用に **実行時の変数**（Settings → Variables and Secrets）に入れます（[contact.md](contact.md) の「設定の手順」）。ビルド用の変数は実行時には読まれません。
- `WORKERS_CI_BRANCH` は Cloudflare がビルド時に自動で入れます。`main` 以外のブランチのビルドは、全ページが noindex になります（[site.md](site.md) の「プレビュー」）。

## 3. 動作を確かめる

1. `main` にプッシュすると、ビルドとデプロイが走る（Worker の **デプロイ（Deployments）** で進み具合とログが見られる）。
2. `https://kaname.<アカウント名>.workers.dev/` で表示を確かめる（このアドレスは `X-Robots-Tag: noindex` が付くので検索エンジンには載らない）。
3. `main` 以外のブランチをプッシュすると、プレビュー用のアドレスができる（**デプロイ** に表示される）。

## 4. 本番ドメインで公開する

ドメインが決まってから行います（[todo.md](todo.md)）。

1. Cloudflare ダッシュボード → **ドメインを追加** → ドメインを入れ、Free プランを選ぶ。既にメールなどのレコードがあれば、取り込まれたレコードを今の DNS と見比べ、足りないものを写す。
2. レジストラ（ドメインを買った会社）の管理画面で、ネームサーバーを Cloudflare が示す2つに変える。Cloudflare でドメインが「有効（Active）」になるまで待つ。
3. `src/constants/index.ts` の `SITE.noindex` を `false` にし、`astro.config.mjs` の `site` を本番のドメインにして `main` に出す。
4. Worker の **設定 → ドメインとルート（Domains & Routes）→ 追加 → カスタムドメイン** に `www.<ドメイン>` を入れる（同じ名前の DNS レコードが残っていると追加できないので、先に消す）。
5. www なし（apex）: DNS に A `192.0.2.1`（ダミー）を **プロキシ（オレンジの雲）** で作り、**ルール → リダイレクトルール** で「ホスト名が `<ドメイン>` と等しい」とき `concat("https://www.<ドメイン>", http.request.uri.path)` へ 301（クエリ文字列を保持）。**SSL/TLS → エッジ証明書 → 常に HTTPS を使用** をオン。
6. **AI Crawl Control** を確かめる。AI のクローラーのブロックや、robots.txt に AI 向けの `Disallow: /` を足す設定が既定でオンのことがあるので、止めるかどうか決める。
7. GA4・Search Console の設定は [analytics.md](analytics.md)。

## うまくいかないとき

| 症状 | 原因と対処 |
|---|---|
| デプロイが KV（SESSION）や IMAGES のバインディングで失敗する | `astro.config.mjs` の `session.driver` と `imageService: "passthrough"` が消えていないか確かめる |
| デプロイが Worker 名の不一致で失敗する | `package.json` の `name` と Worker 名をそろえる |
| `/xxx.html` が `/xxx` に 307 で転送される | Cloudflare の静的配信が `.html` を外す。そのまま返したいファイルは `public/_redirects` に `/xxx.html /xxx 200` を足す |
