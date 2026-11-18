// サイト共通の定数（定数はこのファイルだけに置く。CLAUDE.md の「定数の置き場所ルール」）

// サイト全体の設定
export const SITE = {
  // 会社名（ロゴの表記に合わせた。2026-11-18）
  title: "要合同会社",
  // サイト名の別の書き方（構造化データの alternateName。英字表記などが決まったら入れる）
  alternateNames: [] as string[],
  // 構造化データの Organization に入れるロゴ
  logo: "/images/logo.png",
  // メインコピー（制作指示書の 03 ①）
  catchphrase: "ビジネスの可能性を、さらに先へ。",
  description:
    "営業代行・営業支援を中心に、各種ツール・システムの販売まで。人と企業をつなぎ、新たなビジネスの可能性を広げるパートナーです。",
  // true にすると全ページを noindex にする。本番ドメインで公開する前に必ず false にする（docs/site.md の「サイト全体の noindex」）
  // workers.dev のアドレスとプレビューのビルドは false でも検索エンジンに載らない（public/_headers・src/libs/env.ts）
  noindex: true,
};

// サイト内のナビゲーション（ヘッダー・フッター）。制作指示書の 02
export const NAV = {
  // ヘッダーに並べるページ（英字はメニューの表示、ja はスマホのメニューとフッターで添える和文）
  main: [
    { href: "/about/", label: "ABOUT", ja: "私たちについて" },
    { href: "/service/", label: "SERVICE", ja: "事業内容" },
    { href: "/company/", label: "COMPANY", ja: "会社概要" },
    { href: "/contact/", label: "CONTACT", ja: "お問い合わせ" },
  ],
  // フッターだけに出すページ
  footer: [{ href: "/privacy-policy/", label: "プライバシーポリシー" }],
} as const;

// お問い合わせフォーム（仕様: docs/contact.md）
export const CONTACT = {
  // フォームのページと、送信完了のページ
  path: "/contact/",
  thanksPath: "/contact/thanks/",
  // microCMS の API のエンドポイント（項目定義は schema/contacts.json）
  endpoint: "contacts",
  // メールアドレスの形式チェック（サーバー側のチェックと、送信ボタンの有効化の両方で使う）
  emailPattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
  // 入力の文字数の上限（いたずらや誤送信の防止）
  maxLength: {
    name: 50,
    company: 100,
    email: 254,
    message: 3000,
  },
} as const;

// 検索エンジン（アクセス解析ツールは使わない。2026-11-18 決定）
export const ANALYTICS = {
  // Search Console の確認用 HTML タグ（<meta name="google-site-verification" content="..."> の content の値）。
  // 確認は DNS の TXT で行うので通常は空のまま。HTML タグで確認するときだけ入れる（docs/analytics.md）
  googleSiteVerification: "",
} as const;
