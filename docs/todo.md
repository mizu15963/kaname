# やることリスト

## 仕様で決めること（決まったらコードの `TODO(仕様)` を差し替える）

- サイト名・キャッチコピー・説明文（`SITE`）、本番のドメイン（`astro.config.mjs` の `site`）
- カテゴリとハブページ（`CATEGORY.hubs`・`src/pages/sample-hub.astro`・`HubIcon.astro`・microCMS の categories）
- TOP・ハブページの文章とよくある質問
- 配色・参考サイト・ロゴ・OG 画像・アイコン（`global.css` の `@theme`・`Logo.astro`・`public/images/`）
- 運営者情報・プライバシーポリシーの文面（制定日は公開日）
- 広告（アフィリエイト）の有無。なければ記事先頭のプロモーション表記・埋め込み HTML・PC 右のバナーを見直す
- お問い合わせ: 種別の選択肢、通知メールの宛先、返信の運用、自動返信の有無（[contact.md](contact.md)）

## 作業

- [ ] microCMS のサービスを作り、categories → blog → contacts を作る（[microcms.md](microcms.md)）
- [ ] Cloudflare Workers Builds をつなぎ、workers.dev で表示を確かめる（[cloudflare.md](cloudflare.md) の 1〜3）
- [ ] デプロイフックを microCMS の Webhook に登録する（[cloudflare.md](cloudflare.md) の 4）
- [ ] お問い合わせ: Turnstile・実行時の変数・テスト送信・通知メール（[contact.md](contact.md)）
- [ ] 公開前に `SITE.noindex` を `false` にする（いまは `true`）
- [ ] 公開: DNS → カスタムドメイン → www なしの転送・常に HTTPS → AI Crawl Control → GA4・Search Console（[cloudflare.md](cloudflare.md) の 5、[analytics.md](analytics.md)）
