// サイト共通の定数（定数はこのファイルだけに置く。CLAUDE.md の「定数の置き場所ルール」）

// サイト全体の設定
export const SITE = {
  // TODO(仕様): サイト名・キャッチコピー・説明文は仕様が決まったら差し替える（docs/todo.md）
  title: "サイト名（仮）",
  // サイト名の別の書き方（構造化データの alternateName。Google がサイト名を見分ける手がかりにする）
  alternateNames: [] as string[],
  // 構造化データの Organization に入れるロゴ
  logo: "/images/logo.png",
  // キャッチコピー（TOP の見出しと PC 幅の左側に出す）
  catchphrase: "キャッチコピー（仮）",
  description: "サイト名（仮）は、〇〇について解説する情報サイトです。",
  // true にすると全ページを noindex にする。本番ドメインで公開する前に必ず false にする（docs/site.md の「サイト全体の noindex」）
  // workers.dev のアドレスとプレビューのビルドは false でも検索エンジンに載らない（public/_headers・src/libs/env.ts）
  noindex: true,
};

// 記事
export const BLOG = {
  // 記事一覧（カテゴリでの絞り込みもこのページだけで行う。docs/site.md の「記事一覧」）
  listPath: "/articles/",
  // TOP とハブページに出す新着記事の数（続きは記事一覧で見る）
  latestCount: 6,
} as const;

// カテゴリ（microCMS の categories のコンテンツID）
export const CATEGORY = {
  // ハブページ（/{id}/）があるカテゴリと、ハブページの見出し（ヘッダーのナビにも使う）・TOP のカードの説明
  // TODO(仕様): カテゴリが決まったら差し替える。ページは src/pages/{id}.astro に作る
  hubs: [
    {
      id: "sample-hub",
      title: "サンプルカテゴリ",
      lead: "カテゴリの説明（仮）",
    },
  ],
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
    email: 254,
    message: 3000,
  },
} as const;

// アクセス解析
export const ANALYTICS = {
  // GA4 の測定ID（ページの HTML に載る公開値）。空にすると計測しない（docs/analytics.md）
  ga4MeasurementId: "",
  // Search Console の確認用 HTML タグ（<meta name="google-site-verification" content="..."> の content の値）。
  // 確認は DNS の TXT で行うので通常は空のまま。HTML タグで確認するときだけ入れる（docs/analytics.md）
  googleSiteVerification: "",
} as const;
