// @ts-check
import { defineConfig, envField, sessionDrivers } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  // TODO(仕様): 本番のドメインが決まったら差し替える（canonical・OGP・サイトマップに使う）
  site: "https://www.example.com/",
  // URL の末尾に「/」を付ける（docs/site.md の「URL」）
  trailingSlash: "always",
  build: { format: "directory" },
  // セッション機能は使っていない。指定しないと Cloudflare アダプターが KV（SESSION）を自動で足し、プレビューのデプロイが失敗するため、メモリに置く lruCache にしている（Astro 7 では memory がないため）
  session: { driver: sessionDrivers.lruCache() },
  // 画像の変換（astro:assets）は使わないため passthrough にする（Cloudflare Images の IMAGES バインディングを作らないため）
  adapter: cloudflare({
    prerenderEnvironment: "node",
    imageService: "passthrough",
  }),
  env: {
    schema: {
      // microCMS はお問い合わせの保存（contacts）にだけ使い、Worker の実行時に読む。ビルドには要らない
      MICROCMS_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      MICROCMS_SERVICE_DOMAIN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      // Cloudflare Turnstile（お問い合わせフォームの自動送信よけ）のサイトキーとシークレットキー。Worker の実行時の変数に入れる。
      // 未設定の間、お問い合わせフォームは「準備中」と表示する（docs/contact.md）。サイトキーは公開される値だが、実行時に読むためシークレットと同じ扱いにする
      TURNSTILE_SITE_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      TURNSTILE_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      // Cloudflare Workers Builds がビルド時に入れるブランチ名。main 以外（プレビュー）のときは全ページを noindex にする（docs/site.md の「プレビュー」）
      WORKERS_CI_BRANCH: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
