# generate-catalog

`examples/devices/**/metadata.md` と `upstream/sources.yaml` を入力として、機械処理用の `catalog/*.json` を生成する CLI です。

## データの流れ

```txt
examples/devices/**/metadata.md
upstream/sources.yaml
  ↓
tools/generate-catalog
  ↓
catalog/*.json
  ↓
tools/generate-docs
```

## 使い方

```bash
pnpm catalog:generate
```

## 入力

```txt
examples/devices/**/metadata.md
upstream/sources.yaml
```

`metadata.md` の Markdown 表は `tools/validate-metadata` と同じ形式を前提とします。事前に `pnpm metadata:validate` で検証することを推奨します。

## 出力

```txt
catalog/
  examples.json
  platforms.json
  device-example-map.json
  upstreams.json
```

- `examples.json`: 全デバイスの platform 別 Example をフラットな配列で出力
- `device-example-map.json`: デバイス ID ごとに Example をグループ化
- `platforms.json`: `upstream/sources.yaml` の `platform` と `description`（同一 platform は先勝ち）
- `upstreams.json`: `upstream/sources.yaml` の同期元一覧

## 生成しないもの

本リポジトリでは次を **生成しません**（[chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) が正本）。

- `catalog/devices.json`
- `catalog/products.json`
- 商品リンク、商品画像、回路図、データシート

## 書き込み方針

- `catalog/` が無い場合は作成します
- 既存 JSON と生成結果を比較し、差分がある場合のみ書き込みます（`write-json-if-changed`）

## ファイル構成

```txt
tools/generate-catalog/
  README.md
  src/
    main.ts
    collect-metadata-files.ts
    parse-metadata.ts
    generate-examples-json.ts
    generate-platforms-json.ts
    generate-device-example-map-json.ts
    generate-upstreams-json.ts
    load-upstream-sources.ts
    write-json-if-changed.ts
    types.ts
```
