# やることリスト

## 仕様で決めること（決まったらコードの `TODO(仕様)` を差し替える）

- SERVICE 01 の支援領域の確定、取扱商品の正式名称・販売権限・契約形態、FX ツールの法令確認（リスク表示は載せない方針。2026-11-18 決定）（`service.astro`）
- 特定商取引法の表示が要るか（制作指示書 08）
- プライバシーポリシーの文面（制定日は公開日）
- お問い合わせ: 自動返信の有無（[contact.md](contact.md)）

## 作業

- [ ] 本番のドメインを取得したら、Turnstile のウィジェットのホスト名に足す（[contact.md](contact.md) の「設定の手順」の4）
- [ ] 公開前に `SITE.noindex` を `false` にする（いまは `true`）
- [ ] 公開: DNS → カスタムドメイン → www なしの転送・常に HTTPS → AI Crawl Control → Search Console（[cloudflare.md](cloudflare.md) の 4、[analytics.md](analytics.md)）
