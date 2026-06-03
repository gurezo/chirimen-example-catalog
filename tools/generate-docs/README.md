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

初期実装では、catalog を読み込み、各配列の件数をログ出力します。device / platform / appendix の Markdown 生成は後続 issue で追加します。

## ファイル構成

```txt
tools/generate-docs/
  README.md
  src/
    main.ts
    load-catalog.ts
    write-file-if-changed.ts
    types.ts
```

- `load-catalog.ts`: 4 種の catalog JSON を読み込む
- `write-file-if-changed.ts`: 内容が変わった場合のみファイルを書き込む（#51 以降の generator で使用）
- `types.ts`: catalog の型定義
