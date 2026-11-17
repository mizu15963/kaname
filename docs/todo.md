# やることリスト

## 仕様で決めること（決まったらコードの `TODO(仕様)` を差し替える）

- 会社の正式名称（`SITE.title`）・代表者・所在地・設立・連絡先（`company.astro`）、本番のドメイン（`astro.config.mjs` の `site`）
- SERVICE 01 の支援領域の確定、取扱商品の正式名称・販売権限・契約形態、FX ツールの法令確認とリスク表示（`service.astro`）
- 特定商取引法の表示が要るか（制作指示書 08）
- ロゴ（`Logo.astro`）と、ロゴ入りの OG 画像・アイコン（`public/images/`）
- プライバシーポリシーの文面（制定日は公開日）
- お問い合わせ: 通知メールの宛先、返信の運用、自動返信の有無（[contact.md](contact.md)）

## 作業

- [ ] microCMS のサービスを作り、contacts を作る（[microcms.md](microcms.md)）
- [ ] Cloudflare Workers Builds をつなぎ、workers.dev で表示を確かめる（[cloudflare.md](cloudflare.md) の 1〜3）
- [ ] お問い合わせ: Turnstile・実行時の変数・テスト送信・通知メール（[contact.md](contact.md)）
- [ ] 公開前に `SITE.noindex` を `false` にする（いまは `true`）
- [ ] 公開: DNS → カスタムドメイン → www なしの転送・常に HTTPS → AI Crawl Control → GA4・Search Console（[cloudflare.md](cloudflare.md) の 4、[analytics.md](analytics.md)）
