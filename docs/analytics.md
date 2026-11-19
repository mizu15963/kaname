# Search Console

アクセス解析ツール（GA4 など）は使わない（2026-11-18 決定）。プライバシーポリシーにもアクセス解析の項目を置かない。使うことになったら、計測のタグとプライバシーポリシーの項目を合わせて足す。

## Search Console

1. **ドメインプロパティ** を作り、DNS の TXT レコードで所有権を確認する（DNS は Cloudflare。作り直しや URL の変化に左右されない）。
2. `ANALYTICS.googleSiteVerification` は、HTML タグで確認するときだけ入れる（通常は空のまま）。
3. 公開したら `https://www.<ドメイン>/sitemap.xml` を送信し、TOP と主なページを URL 検査でインデックス登録をリクエストする。robots.txt が取得できているか確かめる。

登録状況: 2026-11-19 に kaname-sales.com をドメインプロパティで登録（Cloudflare の自動 TXT 認証）し、`https://www.kaname-sales.com/sitemap.xml` を送信済み。ドメインプロパティでは、サイトマップを `sitemap.xml` だけで入れると「無効」になるので、URL を全部入れる。

## 公開後に見ること

- 翌日: サイトマップの「検出されたページ」の数。
- 1〜4 週間: 404・インデックス登録の状況・検索パフォーマンス（サイト名で検索して TOP が出るか）。
- 1 か月後: ウェブに関する主な指標（Core Web Vitals）。
