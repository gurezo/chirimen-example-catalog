# CHIRIMEN Example Catalog

CHIRIMEN Example Catalog は、CHIRIMEN 関連リポジトリに散在している Example（サンプルコード）を収集・分類・比較するための実験的なカタログリポジトリです。

このリポジトリは、既存の CHIRIMEN 公式リポジトリを置き換えるものではありません。  
同じデバイスのサンプルコードが複数のリポジトリに存在している状態を可視化し、将来的な整理・移行・ドキュメント化のための土台を作ることを目的としています。

## 目的

- CHIRIMEN 関連リポジトリに散在している Example を整理する
- 同じデバイスのサンプルコードをデバイス単位で比較できるようにする
- 現行サンプル、旧サンプル、archive 扱いのサンプルを区別する
- 商品リンク、回路図、データシート、商品イメージを Example と紐づける
- `metadata.md` を使って、CI に詳しくないメンバーでも情報を更新できるようにする
- 将来的に CHIRIMEN デバイスリストやドキュメントサイトと連携できる catalog JSON を生成する

## このリポジトリがやらないこと

- 既存の CHIRIMEN 公式リポジトリを置き換えること
- すべてのサンプルコードを即座に正規化すること
- 実機確認していないコードを推奨サンプルとして扱うこと
- 古いサンプルを理由なく削除すること

## 基本方針

このリポジトリでは、各デバイスの `metadata.md` を一次情報として扱います。

```txt
examples/devices/<device-id>/metadata.md
```

`metadata.md` には、デバイスの基本情報、商品リンク、商品イメージ、回路図、データシート、サンプルコード、同期元リポジトリ、推奨サンプル、実機確認状況を記録します。

`catalog/*.json` は、`metadata.md` から生成される二次情報です。

```txt
metadata.md
  ↓
catalog/*.json
  ↓
docs / dashboard / reports
```

## ディレクトリ構成

```txt
examples/
  devices/
    <device-id>/
      README.md
      metadata.md
      platforms/
        <platform>/
          README.md
          src/

docs/
  HonKit 用ドキュメント

catalog/
  生成された JSON catalog

upstream/
  同期元リポジトリ定義

generated/
  upstream の raw mirror とレポート

tools/
  同期・生成・検証スクリプト
```

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

ただし、upstream から取り込むサンプルコードは、元リポジトリのライセンスと著作権表示を尊重します。  
取り込んだファイルの出典は `metadata.md` と `generated/reports/` に記録します。
