# detect-duplicates

`catalog/*.json` を入力として、同じ Device ID に複数 platform / upstream の Example が存在するデバイスを検出し、レポートを生成する CLI です。

## 使い方

```bash
pnpm duplicates:detect
```

## 前提

リポジトリルートに、次の catalog ファイルが存在すること。

```txt
catalog/examples.json
catalog/device-example-map.json
```

`catalog/*.json` は `pnpm catalog:generate`（`tools/generate-catalog`）で生成する想定です。

## 入出力

### 入力

```txt
catalog/examples.json
catalog/device-example-map.json
```

### 出力

```txt
generated/reports/duplicated-devices.md
```

## 重複の定義

同一 `deviceId` に対して Example が **2 件以上** 存在する場合を重複として扱います。検出は `catalog/device-example-map.json` を正とします。

## `generate-docs` との違い

| 項目 | `detect-duplicates` | `generate-docs` |
| --- | --- | --- |
| 出力 | `generated/reports/duplicated-devices.md` | `docs/appendix/duplicated-devices.md` |
| 用途 | レポート（`sync-summary.md` と同系列） | HonKit ドキュメント |

レポート形式は付録ページと同等ですが、本ツールは独立実装です。

## ファイル構成

```txt
tools/detect-duplicates/
  README.md
  src/
    main.ts
    load-catalog.ts
    detect-duplicated-devices.ts
    render-duplicated-devices-report.ts
    write-file-if-changed.ts
    types.ts
```
