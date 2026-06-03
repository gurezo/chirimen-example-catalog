# generate-docs

`catalog/*.json` を入力として、HonKit 用の `docs/` 配下 Markdown を生成する CLI です。

`metadata.md` は直接 parse しません。一次情報は `examples/devices/**/metadata.md`、二次情報は `catalog/*.json` です。

## データの流れ

```txt
examples/devices/**/metadata.md
  ↓
tools/generate-catalog  （別途実装）
  ↓
catalog/*.json
  ↓
tools/generate-docs
  ↓
docs/*.md
```

## 使い方

```bash
pnpm docs:generate
```

### 前提

リポジトリルートに、次の catalog ファイルが存在すること。

```txt
catalog/
  examples.json
  platforms.json
  device-example-map.json
  upstreams.json
```

いずれかが欠けている場合、または JSON が不正な場合はエラーで終了します。

`catalog/*.json` は `pnpm catalog:generate`（`tools/generate-catalog`）で生成する想定です。現時点では手動または一時ファイルでの検証が必要な場合があります。

本リポジトリでは `catalog/devices.json` と `catalog/products.json` は持ちません。デバイス本体情報は [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) を正とします。

## 現状の動作

`pnpm docs:generate` は catalog を読み込み、以下を生成します。

```txt
docs/devices/<device-id>.md    # catalog/device-example-map.json 由来
docs/platforms/<platform>.md   # catalog/examples.json を platform ごとに集約
```

- 内容が変わったファイルのみ `write-file-if-changed` で書き込みます
- 商品リンク、商品画像、回路図、データシートは出力しません（device-dashboard を参照）
- `docs/appendix/*.md` の生成は #52 で追加予定

## ファイル構成

```txt
tools/generate-docs/
  README.md
  src/
    main.ts
    load-catalog.ts
    generate-device-docs.ts
    generate-platform-docs.ts
    write-file-if-changed.ts
    types.ts
```

- `load-catalog.ts`: 4 種の catalog JSON を読み込む
- `generate-device-docs.ts`: `docs/devices/<device-id>.md` を生成
- `generate-platform-docs.ts`: `docs/platforms/<platform>.md` を生成
- `write-file-if-changed.ts`: 内容が変わった場合のみファイルを書き込む
- `types.ts`: catalog の型定義
