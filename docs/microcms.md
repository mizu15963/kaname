# microCMS

## サービスを作る（最初に1回）

1. microCMS にログインし、**サービスを作成** → サービス名（サイト名でよい）とサービスID を決める。サービスID が `MICROCMS_SERVICE_DOMAIN`（管理画面の URL `https://<サービスID>.microcms.io` の `<サービスID>`）になる。
2. 下の「API の作り方」で `categories` → `blog` → `contacts` を作る。
3. 下の「API キー」のとおり権限を付けたキーを用意する。
4. 手元で試すときは、リポジトリ直下の `.env` に書く（コミットしない）。

```
MICROCMS_SERVICE_DOMAIN=<サービスID>
MICROCMS_API_KEY=<APIキー>
```

5. Cloudflare の変数に同じ値を入れる（[cloudflare.md](cloudflare.md)）。

## API

| API | エンドポイント | 形式 | 項目の定義 |
|---|---|---|---|
| 記事 | `blog` | リスト形式 | [schema/blog.json](../schema/blog.json) |
| カテゴリ | `categories` | リスト形式 | [schema/categories.json](../schema/categories.json) |
| お問い合わせ | `contacts` | リスト形式 | [schema/contacts.json](../schema/contacts.json) |

- `schema/` のファイルは microCMS の「スキーマの書き出し」と同じ形式です。API を作るときに、このファイルをインポートして項目を作ります（作り方は下の「API の作り方」）。
- 管理画面で項目を変えたら、スキーマを書き出して `schema/` のファイルを上書きしてください。
- Hobby プランは作れる API の数とキーの数に上限があります。3つで収まる想定ですが、契約中のプランの上限を確認してください。

## blog（記事）

コンテンツID = 記事の URL のスラッグ（[article.md](article.md) の「URL の決まり方」）。

| フィールドID | 表示名 | 種類 | 必須 | 説明 |
|---|---|---|---|---|
| `title` | タイトル | テキストフィールド | ○ | 記事タイトル（h1） |
| `description` | 概要 | テキストエリア | | メタディスクリプション・記事一覧の概要 |
| `content` | 本文 | リッチエディタ | ○ | |
| `thumbnail` | サムネイル画像 | 画像 | | 一覧・OG 画像に使う |
| `category` | カテゴリ | 複数コンテンツ参照（categories） | | 複数選べる。ハブページと記事一覧の絞り込みに使う |
| `urlSlug` | URL（例外用） | テキストフィールド | | 日本語などコンテンツIDに使えない URL にしたい記事だけ |
| `seoTitle` | 検索結果用のタイトル | テキストフィールド | | `<title>` を記事タイトルと変えたいときだけ |
| `noindex` | 検索エンジンに載せない | 真偽値 | | 既定はオフ |
| `embeds` | 埋め込み HTML | 繰り返しフィールド（カスタムフィールド `embed`） | | script・iframe を使う広告タグなど。本文に `［埋め込み:名前］` と書いた場所に出る（[article.md](article.md) の「埋め込み HTML」） |

カスタムフィールド `embed`（埋め込み HTML）:

| フィールドID | 表示名 | 種類 | 必須 | 説明 |
|---|---|---|---|---|
| `name` | 名前 | テキストフィールド | ○ | 本文の印 `［埋め込み:名前］` に書く名前 |
| `html` | HTML | テキストエリア | | ASP からコピーしたタグをそのまま貼る |

## categories（カテゴリ）

コンテンツIDは URL や絞り込みの値に使うので、後から変えないでください。

| コンテンツID | カテゴリ名 | ハブページ |
|---|---|---|
| `sample-hub` | サンプルカテゴリ（仮。TODO(仕様): カテゴリが決まったら差し替える） | `/sample-hub/` |

| フィールドID | 表示名 | 種類 | 必須 |
|---|---|---|---|
| `name` | カテゴリ名 | テキストフィールド | ○ |

- 絞り込みのチップの並び順は、管理画面の並び順。
- ハブページの見出しとヘッダーのナビは `src/constants/index.ts` の `CATEGORY.hubs`（カテゴリ名とは別に管理）。

## contacts（お問い合わせ）

フォームから送られた内容を下書きで保存します（サイトには公開されません）。フォームの作りは [contact.md](contact.md)。

| フィールドID | 表示名 | 種類 |
|---|---|---|
| `name` | お名前 | テキストフィールド |
| `email` | メールアドレス | テキストフィールド |
| `category` | お問い合わせ種別 | セレクトフィールド（記事について / 掲載・広告について / 個人情報の取り扱いについて / その他） |
| `message` | お問い合わせ内容 | テキストエリア |

## API の作り方

1. 管理画面で **API を作成** → **自分で決める**（またはスキーマのインポート）を選ぶ。
2. API 名・エンドポイント（`categories` → `blog` → `contacts` の順。`blog` のカテゴリが `categories` を参照するため）を入れ、リスト形式を選ぶ。
3. `schema/` の JSON をインポートする。インポートできなかった項目は、上の表のとおり手で作る。
4. `categories` に上の表のカテゴリを、表のコンテンツIDで作る（記事を1本も入れなくてもビルドは通る）。

## API キー

キーはチャットやリポジトリに書かず、手元の `.env` と Cloudflare の変数にだけ入れてください。

| キー | 権限 | 使う場所 |
|---|---|---|
| 共通（`MICROCMS_API_KEY`） | `blog`・`categories` の GET、`contacts` の POST のみ | ビルド（手元と Cloudflare）と、お問い合わせフォームの保存（Worker の実行時） |

`contacts` には GET を付けません（キーが漏れても、お問い合わせの個人情報を読み出されないように）。Hobby プランはキーを増やせないため、お問い合わせ用にキーを分けずに共通のキーに POST を足しています。

## Webhook

- `blog` と `categories` の **API 設定 → Webhook → カスタム通知** に、Cloudflare のデプロイフックの URL を登録する（[cloudflare.md](cloudflare.md) の「microCMS の更新で再ビルドする」）。通知のタイミングは「コンテンツの公開・公開終了・削除」など、公開中の内容が変わるもの。
- `contacts` にはデプロイフックを登録しない（お問い合わせのたびに再ビルドされるため）。代わりに **メール通知** で、届いたことを知らせる（[contact.md](contact.md) の「設定の手順」）。
