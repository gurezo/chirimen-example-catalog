# metadata.md の書き方

`metadata.md` は、各デバイスの **Example 管理情報** を記録する Markdown ファイルです。

```txt
examples/devices/<device-id>/metadata.md
```

## 責務分離

| 情報 | 正本 |
|---|---|
| 商品リンク・画像・回路図・データシート・カテゴリ・タグ・説明 | [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) |
| platform 別 Example・upstream・状態・推奨・実機確認・移行メモ | **本リポジトリ** |

## なぜ Markdown で管理するのか

CI に詳しくないメンバーでも GitHub 上で編集しやすいように、Markdown を一次情報として使います。

## metadata.md に書く内容

- 基本情報（Device ID、型番、Device Dashboard リンク）
- Platform 別 Example 一覧（Local Path、Upstream、状態）
- 推奨 Example
- 実機確認状況
- 移行メモ

## 必須の見出し

以下の見出しは変更しないでください。

```md
## 基本情報
## Platform 別 Example
## 推奨 Example
## 移行メモ
```

CI はこれらの見出しと表構造を確認します。

## Device Dashboard リンク

各デバイスの `metadata.md` には、chirimen-device-dashboard 上の該当ページ URL を記載してください。

```md
| Device Dashboard | `https://chirimen-device-dashboard.web.app/devices/adt7410` |
```

未設定の場合は `generated/reports/missing-device-dashboard-link.md` に記録されます（warning）。

## 空欄でよい項目

- 存在しない platform の行（該当 Example がない場合）
- 確認日・確認者（未確認の場合）

## 実機確認

```md
| 実機確認 | 未確認 |
```

確認済みの場合:

```md
| 実機確認 | 確認済み |
| 確認日 | 2026-05-25 |
| 確認者 | @your-github-id |
```

## 状態の書き方

| 状態 | 意味 |
|---|---|
| primary | 現行候補 |
| legacy | 参照用の旧サンプル |
| archive | 旧構成として保存 |
| special | 特殊用途 |
| incubator | 整理前・検討中 |

## Platform 名

| Platform | 説明 |
|---|---|
| `pizero-esm` | CHIRIMEN Pi Zero ESM examples |
| `raspi-node` | Raspberry Pi / Node.js examples |
| `node` | Node.js examples |
| `microbit-driver` | chirimen-drivers 側の micro:bit examples |
| `microbit-web` | chirimen-micro-bit examples |
| `legacy-gc-gpio` | 旧 CHIRIMEN GPIO examples |
| `legacy-gc-i2c` | 旧 CHIRIMEN I2C examples |
| `remote` | remote-connection examples |
| `pre-arranged` | pre-arrangement-contributions |
