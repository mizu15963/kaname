# アクセス解析（GA4・Search Console）

## GA4

1. Google アナリティクスでプロパティとウェブストリーム（本番の URL）を作り、測定ID（`G-XXXXXXXXXX`）を `src/constants/index.ts` の `ANALYTICS.ga4MeasurementId` に入れる。測定ID はページの HTML に載る公開値なので、リポジトリに書いてよい。
2. `Layout.astro` は本番のホスト（`astro.config.mjs` の `site`）で開いたときだけ計測のタグを出す。手元・workers.dev・プレビューは計測しない。
3. データの保持期間を 14 か月にする（管理 → データの収集と修正 → データ保持）。
4. 任意: お問い合わせの送信完了（`/contact/thanks/`）の表示をキーイベントにする。

## Search Console

1. **ドメインプロパティ** を作り、DNS の TXT レコードで所有権を確認する（DNS は Cloudflare。作り直しや URL の変化に左右されない）。
2. `ANALYTICS.googleSiteVerification` は、HTML タグで確認するときだけ入れる（通常は空のまま）。
3. 公開したら `https://www.<ドメイン>/sitemap.xml` を送信し、TOP とハブページを URL 検査でインデックス登録をリクエストする。robots.txt が取得できているか確かめる。

## 公開後に見ること

- 翌日: サイトマップの「検出されたページ」の数。
- 1〜4 週間: 404・インデックス登録の状況・検索パフォーマンス（サイト名で検索して TOP が出るか）。
- 1 か月後: ウェブに関する主な指標（Core Web Vitals）。
