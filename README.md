# サイト名（仮）

Astro で作ったページを Cloudflare Workers で配信するサイトのリポジトリです。お問い合わせの保存に microCMS を使います。

- サイトの仕様: [docs/](docs/README.md)（目次）
- 残っている作業: [docs/todo.md](docs/todo.md)（やることリスト）
- 開発のルール（定数・色・形・仕様書の更新など）: [CLAUDE.md](CLAUDE.md)

## 構成

| 役割 | 使っているもの |
|---|---|
| サイトの生成 | Astro 7（`@astrojs/cloudflare` アダプター。すべてのページをビルド時に作る） |
| 見た目 | Tailwind CSS 4（色・形は `src/styles/global.css` の `@theme` で一括管理） |
| お問い合わせの保存 | microCMS（`contacts` の API だけ） |
| 配信 | Cloudflare Workers（Workers Builds で GitHub と接続） |
| アクセス解析 | Google アナリティクス 4（本番のドメインでだけ計測） |

## フォルダ構成

| フォルダ | 中身 |
|---|---|
| `src/pages/` | ページ（URL と同じ並び） |
| `src/components/` | 部品（ページ見出し、ヘッダー、パンくずなど） |
| `src/layouts/` | 全ページ共通の枠（head・ヘッダー・フッター） |
| `src/libs/` | microCMS の取得、表示の整形、構造化データ、ビルド環境の判定 |
| `src/constants/index.ts` | サイト共通の定数（定数はこのファイルだけに置く） |
| `src/styles/global.css` | 色・形の定義（`@theme`） |
| `schema/` | microCMS の項目定義（スキーマの書き出し形式） |
| `public/` | そのまま配信するファイル（画像・アイコン・`_redirects`・`_headers`） |
| `docs/` | 仕様書 |

## 開発の仕方

Node.js 24 以上が必要です。

1. パッケージをインストールします。

   ```bash
   npm install
   ```

2. ルート直下に `.env` を作り、次の値を入れます（値は Cloudflare に登録しているものと同じ。リポジトリには含めない）。

   ```
   MICROCMS_API_KEY=xxxxxxxxxx
   MICROCMS_SERVICE_DOMAIN=xxxxxxxxxx
   ```

   | 名前 | 内容 |
   |---|---|
   | `MICROCMS_API_KEY` | microCMS の API キー（`contacts` の POST のみ許可。お問い合わせフォームを手元で試すときだけ要る） |
   | `MICROCMS_SERVICE_DOMAIN` | microCMS の管理画面の URL（`https://xxxxxxxx.microcms.io`）の `xxxxxxxx` の部分 |

3. 開発用のサーバーを起動し、http://localhost:4321 を開きます。

   ```bash
   npm run dev
   ```

### 本番と同じ形で確かめる

```bash
npm run build
npx astro preview
```

`astro preview` は Cloudflare と同じ仕組み（wrangler）で `dist/` を配信するので、`public/_redirects` の転送や末尾の `/` の扱いも確かめられます。


## ブランチの運用

- `main` は本番用。プッシュすると Cloudflare で自動でビルド・デプロイされます。直接プッシュせず、作業ブランチ（例 `feature/contact-form`）から PR を作ってマージします。
- `main` 以外のブランチは、プレビュー用のアドレスにデプロイされます。プレビューは全ページ noindex です（[docs/site.md](docs/site.md) の「プレビュー」）。

## 本番への反映（自動ビルド）

GitHub Actions は使わず、Cloudflare Workers Builds だけでビルド・デプロイします。接続の手順は [docs/cloudflare.md](docs/cloudflare.md) です。

| きっかけ | 動き |
|---|---|
| `main` ブランチへのプッシュ | Cloudflare が GitHub 連携で検知し、自動でビルド・デプロイ |

デプロイフックの URL は、知っていれば誰でもビルドを起動できるため、外部に公開しないでください。
