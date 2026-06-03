# sync-upstreams

`upstream/sources.yaml` を読み込み、CHIRIMEN 関連リポジトリの Example を同期する CLI です。

## 前提

- Node.js v24.x
- pnpm v11.x
- **git**（`git clone` / `git fetch` に使用）

## 使い方

```bash
pnpm sync:upstreams
```

## 入出力

### 入力

```txt
upstream/sources.yaml
```

### 出力

```txt
generated/upstreams/<source-id>/     # upstream の path 配下の raw mirror
generated/upstreams/_repos/          # 同一 repo+branch の clone キャッシュ（ローカル用）
examples/devices/<device-id>/platforms/<platform>/src/  # 条件付き normalized copy
generated/reports/sync-summary.md  # 同期結果レポート
```

## 処理の流れ

1. `upstream/sources.yaml` の各 source を読み込む
2. GitHub から shallow clone（同一 `repo` + `branch` は `_repos` にキャッシュ）
3. YAML の `path` サブツリーを `generated/upstreams/<source-id>/` にコピー
4. mirror 直下のディレクトリ名から `device-id` を推定
5. **catalog に既にある** `examples/devices/<device-id>/` についてのみ、`platforms/<platform>/src/` へファイルをコピー
6. `generated/reports/sync-summary.md` を生成

## 上書き方針

| 対象 | 動作 |
| --- | --- |
| `metadata.md` | 上書きしない |
| `README.md`（device / platform） | 上書きしない |
| `platforms/<platform>/src/**` の新規ファイル | コピーする |
| `platforms/<platform>/src/**` の既存ファイル | 先頭に `<!-- sync-upstreams:managed -->` がある場合のみ上書き |

upstream 側のファイルは、存在しない場合は `src/` 配下へ配置します（upstream が `src/` を持たない構成でも同期可能）。

## device-id の推定

- ディレクトリ名がそのまま有効な device-id の場合（例: `adt7410`）
- 小文字化で有効になる場合
- legacy gc の接頭辞（`i2c-`, `gpio-`）を除去して小文字化（例: `i2c-ADT7410` → `adt7410`）
- 推定できない場合は mirror のみ更新し、normalized copy はスキップ

## normalized copy の対象

`pnpm device:create` などで **既に** `examples/devices/<device-id>/` が存在するデバイスのみ対象です。未登録デバイスは `sync-summary.md` に `skipped (no device dir)` として記録されます。

## ファイル構成

```txt
tools/sync-upstreams/
  README.md
  src/
    main.ts
    load-sources.ts
    clone-or-fetch-source.ts
    copy-examples.ts
    resolve-device-id.ts
    write-sync-summary.ts
    types.ts
```

## PR への generated 出力

初回実行で `generated/upstreams/` と `generated/reports/sync-summary.md` が作成されます。ミラーはリポジトリ容量が大きくなる場合があるため、必要に応じて `chore(generated)` として別コミットに分けてください。
