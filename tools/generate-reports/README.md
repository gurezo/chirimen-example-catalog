# generate-reports

`catalog/examples.json` と `examples/devices/**/metadata.md` を入力として、整理状況レポートを生成する CLI です。

## 使い方

```bash
pnpm reports:generate
```

`catalog/*.json` は事前に `pnpm catalog:generate` で生成しておいてください。upstream 由来の metadata 不足検出には `generated/reports/sync-summary.md`（`pnpm sync:upstreams` の出力）を参照します。

## 出力

| ファイル | 内容 |
| --- | --- |
| `generated/reports/missing-metadata.md` | metadata.md が無いデバイス、platform ディレクトリが無い Example |
| `generated/reports/missing-device-dashboard-link.md` | Device Dashboard URL が未設定のデバイス |

## ファイル構成

```txt
tools/generate-reports/
  README.md
  src/
    main.ts
    load-catalog.ts
    detect-gaps.ts
    parse-sync-summary.ts
    render-reports.ts
    write-file-if-changed.ts
    types.ts
```
