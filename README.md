# Tool Archive — Proof of Craft

CG 制作のなかで書いたスクリプトのギャラリーサイト。

> 構築された論理は、作者の思考の結晶である。
> このアーカイヴは、私の存在の証明である。

**公開URL**: https://fryx404.github.io/Proof-of-Craft/

素の HTML + CSS + JS と `tools.json` だけで動きます。ビルド不要、依存パッケージなし。
（`Proof of Craft` はサイトの通し名でリポジトリ名にも使っています。画面の見出しは `Tool Archive`）

---

## ツールを追加する

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

必須は `id` / `name` / `date` / `tags` / `summary` の 5 つ。
残りは省略でき、空の項目は見出しごと自動で非表示になります。
タグの色は自動で割り当てられるので、新しいタグを増やしても設定は不要です。

各フィールドの詳細は [docs/デザインメモ.md](docs/デザインメモ.md) を参照してください。

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
├── index.html        画面の骨組み + テーマ切替スクリプト（ツール追加時に触らない）
├── tools.json        ★ ツールデータ。編集するのはここ
├── assets/
│   ├── style.css     デザイン（色は冒頭のカラートークンに集約）
│   └── app.js        カード描画・タグ配色・モーダル
├── docs/             設計メモ・公開手順
├── .nojekyll         GitHub Pages の Jekyll 処理を無効化
└── README.md
```

`_url/` はローカル用のショートカット置き場です。公開には不要なので `.gitignore` で除外しています。

## 画面の構成

- **ヒーロー** — 見出し `Tool Archive` と `site.lead` の2行。左上に本サイトへ戻るボタン、右上にテーマ切替
- **カード一覧** — `date` の降順。サムネイル・タグ・ツール名・要約
- **モーダル** — カードをクリックで開く。GIF、Requirements、Install、Launch コード、Usage、Notes、GitHub / ZIP ボタン

`Esc` キーまたは背景クリックでモーダルを閉じられます。

デザインはライト / ダーク / システム連動の 3 モードに対応しています。

---

## ドキュメント

| | |
|---|---|
| [docs/デザインメモ.md](docs/デザインメモ.md) | 配色・書体・余白をどこで変えるか。実装上の落とし穴と、そう作った理由 |
| [docs/更新方法.md](docs/更新方法.md) | GitHub Pages への公開手順とトラブル対応 |

---

© 2025–2026 Takumi Furuya (fryx404)
