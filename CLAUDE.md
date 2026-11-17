# CLAUDE.md

## 言語（最優先ルール）

- ユーザーとの受け答えは **必ず日本語** で行うこと。説明・報告・質問・作業中のコメント・最終回答のすべてが対象。
- 英語のドキュメントやツール出力を参照した後も、返答は日本語で行うこと。
- コード、コマンド、ファイル名、エラーメッセージの引用などは原文のままでよい。

## このサイトの前提

- Astro の静的サイトを Cloudflare Workers Builds でビルド・配信する（仕様: `docs/`）。microCMS はお問い合わせの保存（`contacts`）にだけ使い、記事・カテゴリの API は作らない。
- すべてのページをビルド時に作る（例外はお問い合わせフォーム `/contact/` だけ。送信を受け取るためアクセス時に作る）。URL の末尾には `/` を付ける。
- 仕様が決まっていない値は `TODO(仕様)` のコメントを付けた仮の値にしている（一覧は `docs/todo.md`）。

## 定数の置き場所ルール

- 定数ファイルは `src/constants/index.ts` の1つだけにする。新しい定数ファイルを作らない。
- 定数は機能ごとのオブジェクト（`SITE`、`NAV`、`CONTACT` など）にまとめ、ファイル直下に単独の定数を増やさない。
- 使う側は必ず `@constants/index.ts` から import する。

| 値の種類 | 置き場所 |
|---|---|
| 秘密ではなく、環境で変わらないサイト共通の設定値 | `src/constants/index.ts` |
| 秘密の値・環境ごとに変わる値 | `.env` と Cloudflare の変数（`astro:env` で読む） |
| ページの本文 | 各ページファイルに直接書く |
| 1つのコンポーネント内でしか使わない値 | そのコンポーネント内 |

## ブランチの運用

- `main` は本番用（プッシュすると Cloudflare で自動でビルド・デプロイされる）。`main` に直接プッシュしない。
- 作業ブランチは `<種類>/<範囲>-<内容>`（種類: feature・fix・hotfix・refactor・docs・chore・release、範囲: top・hub・article・contact・layout・design・cms・seo・infra など。例 `feature/contact-form`）。
- 作業ブランチから PR を作り、`main` へのマージはユーザーが行う。

## やることリスト・仕様書

- 残っている作業と判断が必要な事項は `docs/todo.md` で管理する（終わった作業は削除する）。README には作業リストを書かない。
- サイトの仕様は `docs/` 配下の md ファイルにまとめる（目次は `docs/README.md`）。機能を追加・変更したら、コードと同じコミットで該当する仕様書も更新する。

## 色・形の管理ルール

- サイトの色は `src/styles/global.css` の `@theme` で一括管理する（`docs/design.md` の「配色」）。
- ページやコンポーネントでは役割ごとの色（`bg-primary`、`text-foreground`、`bg-section`、`bg-highlight`、`text-link`、`border-line` など）を使う。必要な場合のみブランドカラー（`brand-50`〜`brand-900`）を使う。`red-600` や `blue-600` などの色を直接指定しない。
- 角丸は箱が `rounded-box`、ボタンが `rounded-button`。チップ・バッジだけ `rounded-full`。`rounded-lg` などを直接使わない。
- 影は原則使わない。ホバーは枠線や文字の色の変化で表す。
- 見た目を変えたら、同じコミットで `docs/design.md` も更新する。

## スマホ表示を優先する

- 画面を作るときはスマホ幅（375px 前後）を基準にし、PC 幅は広げる形で対応する。
- 画面を変更したら、スマホ幅で横スクロール・はみ出し・文字の折り返し崩れがないことを確認する。

## API の項目定義（schema/）

- microCMS の項目定義は `schema/` 配下の JSON（microCMS の「スキーマの書き出し」形式）を正とする。いまはお問い合わせの `schema/contacts.json` だけ。
- microCMS 側で項目を変更したら、スキーマを書き出して `schema/` のファイルを上書きし、`docs/microcms.md` も合わせる。
