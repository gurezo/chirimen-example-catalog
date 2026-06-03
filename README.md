# CHIRIMEN Example Catalog

CHIRIMEN Example Catalog は、CHIRIMEN 関連リポジトリに散在している Example（サンプルコード）を、**デバイスごとに整理し、その中で platform 別に管理する**ための実験的なカタログリポジトリです。

このリポジトリは、既存の CHIRIMEN 公式リポジトリを置き換えるものではありません。  
同じデバイスのサンプルコードが複数のリポジトリに存在している状態を可視化し、将来的な整理・移行・ドキュメント化のための土台を作ることを目的としています。

## 責務分離

| リポジトリ | 役割 |
| --- | --- |
| [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) | デバイス情報の正本（商品リンク・画像・回路図・データシート・説明・カテゴリ・タグ） |
| **chirimen-example-catalog**（本 repo） | Example 情報の正本（platform 別 Example・upstream・状態・実機確認・移行メモ） |

## 目的

- CHIRIMEN 関連リポジトリに散在している Example を整理する
- 同じデバイスのサンプルコードをデバイス単位で比較できるようにする
- 現行サンプル（primary）、旧サンプル（legacy）、archive / special / incubator を区別する
- `metadata.md` を使って、CI に詳しくないメンバーでも情報を更新できるようにする
- [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) への参照リンクを Example と紐づける
- 将来的にドキュメントサイトと連携できる catalog JSON を生成する

## このリポジトリがやらないこと

- 既存の CHIRIMEN 公式リポジトリを置き換えること
- デバイス本体情報（商品リンク・画像・回路図・データシート等）の正本管理（→ device-dashboard 側）
- すべてのサンプルコードを即座に正規化すること
- 実機確認していないコードを推奨サンプルとして扱うこと
- 古いサンプルを理由なく削除すること

## 基本方針

各デバイスの `metadata.md` を一次情報として扱います。

```txt
examples/devices/<device-id>/
  metadata.md
  platforms/<platform>/
```

`metadata.md` には、Example 管理情報（Device Dashboard リンク、platform 別 Example 一覧、upstream、推奨 Example、実機確認、移行メモ）を記録します。

`catalog/*.json` は、`metadata.md` から生成される二次情報です。

```txt
metadata.md
  ↓
catalog/*.json
  ↓
docs / reports
```

## ディレクトリ構成

```txt
examples/devices/<device-id>/
  README.md
  metadata.md
  platforms/<platform>/
    README.md
    src/

upstream/sources.yaml
catalog/          # examples.json, platforms.json, device-example-map.json, upstreams.json
docs/             # HonKit 用ドキュメント（Markdown ソース）
public/           # HonKit ビルド成果物（`pnpm docs:build`、git 管理外）
generated/        # upstream mirror とレポート（自動生成、原則手動編集しない）
tools/            # 同期・生成・検証スクリプト
```

`docs/` 配下の Markdown は HonKit の入力です（`pnpm docs:generate` で `catalog/*.json` から生成されるページを含む）。静的 HTML は `pnpm docs:build` でリポジトリ直下の `public/` に出力し、GitHub Pages デプロイ（`.github/workflows/deploy-docs.yml`）で公開します。HonKit の出力先引数は **book ディレクトリ（`docs/`）基準**のため、ルートの `public/` には `../public` を指定します（`public` のみだと `docs/public/` になります）。

`generated/upstreams/` には upstream の raw mirror（`pnpm sync:upstreams`）を置きます。`generated/reports/` には検証・同期レポート（例: `pnpm duplicates:detect`）を置きます。いずれも tools から生成されるため、原則として手動編集しません。レポートの一覧と注意事項は [generated/reports/README.md](generated/reports/README.md) を参照してください。

## Platform 一覧

| Platform          | 説明                                   |
| ----------------- | -------------------------------------- |
| `pizero-esm`      | `chirimen.org/pizero/src/esm-examples` |
| `raspi-node`      | `chirimen-drivers/raspi-examples`      |
| `node`            | `chirimen-drivers/node-examples`       |
| `microbit-driver` | `chirimen-drivers/microbit-examples`   |
| `microbit-web`    | `chirimen-micro-bit/examples`          |
| `legacy-gc-gpio`  | `chirimen/gc/gpio`                     |
| `legacy-gc-i2c`   | `chirimen/gc/i2c`                      |
| `remote`          | `remote-connection/examples`           |
| `pre-arranged`    | `pre-arrangement-contributions`        |

## 開発環境

- Node.js v24.x
- pnpm v11.x

```bash
pnpm install
```

## 主なコマンド

```bash
pnpm metadata:validate
pnpm catalog:generate
pnpm docs:generate
pnpm docs:build
pnpm sync:upstreams
pnpm duplicates:detect
pnpm validate
```

## コントリビューション

デバイス追加や `metadata.md` の更新手順は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## ライセンス

このリポジトリ自体は MIT License です。

詳細は [NOTICE.md](NOTICE.md) を参照してください。

ただし、upstream から取り込むサンプルコードは、元リポジトリのライセンスと著作権表示を尊重します。  
取り込んだファイルの出典は `metadata.md` と `generated/reports/` に記録します。
