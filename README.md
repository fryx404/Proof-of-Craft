# Tool Archive — Proof of Craft

CG 制作のなかで書いたスクリプトのギャラリーサイト。素の HTML + CSS + JS と `tools.json` だけで動きます。ビルド不要。
（`Proof of Craft` はサイトの通し名で、リポジトリ名にも使っています。画面の見出しは `Tool Archive`）

**公開URL（想定）**: https://fryx404.github.io/Proof-of-Craft/

---

## ツールの追加方法

`tools.json` の `tools` 配列に 1 オブジェクト追加するだけです。HTML は触りません。
並び順は `date` の降順で自動ソートされます。

```json
{
  "id": "ft-new-tool",
  "name": "FT_NewTool",
  "nameJa": "新しいツール",
  "date": "2026-08",
  "version": "1.0",
  "tags": ["Maya", "Python"],
  "summary": "カードに出る1〜2行の説明。",
  "description": "モーダルに出る本文。何のために作ったかを書く。",
  "image": "https://raw.githubusercontent.com/fryx404/FT_NewTool/main/images/sample.gif",
  "repo": "https://github.com/fryx404/FT_NewTool",
  "download": "https://github.com/fryx404/FT_NewTool/archive/refs/heads/main.zip",
  "requirements": ["Maya 2020 以降", "Python 3.x"],
  "install": ["FT_new_tool.py を maya/scripts に配置します。"],
  "code": "import FT_new_tool\nFT_new_tool.show()",
  "usage": ["手順1", "手順2"],
  "notes": ["注意点があれば"]
}
```

### フィールド一覧

| キー | 必須 | 説明 |
|---|---|---|
| `id` | ● | 一意のスラッグ（英小文字とハイフン） |
| `name` | ● | ツール名 |
| `nameJa` | | 日本語名 |
| `date` | ● | `YYYY-MM`。並び順に使用 |
| `version` | | バージョン表記 |
| `tags` | ● | 配列。**色は自動で割り当てられる**（下記参照） |
| `summary` | ● | カードの短い説明 |
| `description` | | モーダルの本文 |
| `image` | | サムネイル。GitHub の raw URL でOK |
| `repo` / `download` | | ボタンのリンク先 |
| `requirements` / `install` / `usage` / `notes` | | 配列。空なら見出しごと非表示 |
| `code` | | 起動用コードブロック。`\n` で改行 |

### タグの色

タグの色は `assets/app.js` の `TAG_COLORS` で決まります。ここに無いタグは、名前から自動で 6 色のいずれかが割り当てられるので、**新しいタグを増やしても設定は不要**です（同じタグ名なら常に同じ色になります）。

色を固定したい場合だけ `TAG_COLORS` に 1 行足してください。

```js
const TAG_COLORS = {
  maya: 'teal',
  python: 'blue',
  houdini: 'coral',   // ← 追加例
};
```

使える色: `teal` / `blue` / `purple` / `coral` / `amber` / `green`

### 画像

画像は GitHub リポジトリの raw URL をそのまま指定できます（形式: `https://raw.githubusercontent.com/fryx404/<repo>/main/images/sample.gif`）。
ローカルに置きたい場合は `assets/img/` を作って `"image": "./assets/img/xxx.gif"` としてください。

---

## 見た目を変える

文言・フォント・色は次の場所にまとまっています。

| 変えたいもの | 場所 |
|---|---|
| 見出し下の2行（思想の文） | `tools.json` の `site.lead`（`<br>` で改行可） |
| ページタイトル | `tools.json` の `site.title` |
| 見出し `Tool Archive` の文字列 | `index.html` の `.hero__title` |
| 見出しの大きさ | `style.css` `.hero__title` の `clamp()` の**第3引数** |
| 見出しの濃さ | `style.css` 冒頭の `--fg-title` |
| 見出しの書体 | `style.css` 冒頭の `--font-serif`（既定は Cormorant Garamond 300） |
| アクセント色（金） | `style.css` 冒頭の `--accent` |
| フッターの著者名 | `index.html` の `.site-footer__copy` |

---

## GitHub Pages への公開手順

`git init` / `commit` / `remote add` までは設定済みです。初回は push から始めます。

```bash
git push -u origin main
```

初回はブラウザが開いて GitHub のログインを求められます（Git Credential Manager）。

続いてリポジトリの **Settings → Pages** で以下を設定します。

- Source: `Deploy from a branch`
- Branch: `main` / `/ (root)`

1〜3分後に https://fryx404.github.io/Proof-of-Craft/ で公開されます。

### 以降の更新

```bash
git add .
git commit -m "Add FT_NewTool"
git push
```

`tools.json` を編集して push するだけで反映されます。

### うまくいかないとき

- **Pages が 404** → リポジトリが Public になっているか確認（Private は無料プランでは公開されない）
- **ページは出るがカードが空** → `tools.json` がリポジトリ直下に push されているか確認
- **サムネイルが出ない** → ツール側リポジトリが Public か、`image` の raw URL のブランチ名が合っているか確認

---

## 本サイトの WORKS からリンクする

`fryx404.github.io` の WORKS ページに、既存カードと同じ形式で 1 件追加します。

- タイトル: `Tool Archive`
- 説明: CG制作のなかで書いたスクリプトをまとめています
- リンク先: `https://fryx404.github.io/Proof-of-Craft/`
- タグ例: `ツール開発` / `Maya` / `Python`

---

## ローカルで確認する

`tools.json` を `fetch` しているため、`index.html` をダブルクリックで開くと CORS で失敗します。
簡易サーバー経由で開いてください。

```bash
npx serve .
# または
python -m http.server 8000
```

---

## ファイル構成

```
Proof-of-Craft/
├── index.html        画面の骨組みのみ（ツール追加時に触らない）
├── tools.json        ★ ツールデータ。編集するのはここ
├── assets/
│   ├── style.css     デザイン（色・書体は冒頭の変数に集約）
│   └── app.js        カード描画・タグ配色・モーダル
├── .nojekyll         GitHub Pages の Jekyll 処理を無効化
├── .gitignore
└── README.md
```

`_url/` はローカル用のショートカット置き場です。公開には不要なので `.gitignore` で除外しています。

## 画面の構成

- **ヒーロー** — 見出し `Tool Archive` と `site.lead` の2行。左上に本サイトへ戻るボタン
- **カード一覧** — `date` の降順。サムネイル・タグ・ツール名・要約
- **モーダル** — カードをクリックで開く。GIF、Requirements、Install、Launch コード、Usage、Notes、GitHub / ZIP ボタン。閉じると次に開いたとき先頭から表示される

`Esc` キーまたは背景クリックでモーダルを閉じられます。
