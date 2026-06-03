# create-device

新しいデバイス Example の雛形を生成する CLI です。

## 使い方

```bash
pnpm device:create <device-id>
pnpm device:create <device-id> --name <name>
pnpm device:create <device-id> --name <name> --dashboard-url <url>
```

### 例

```bash
pnpm device:create adt7410
pnpm device:create adt7410 --name ADT7410
pnpm device:create adt7410 --name ADT7410 --dashboard-url https://chirimen-device-dashboard.web.app/devices/adt7410
```

## 生成物

`pnpm device:create` は、次のファイルを **非上書き** で作成します。

```txt
examples/devices/<device-id>/
  README.md
  metadata.md
  platforms/
    pizero-esm/README.md
    raspi-node/README.md
    node/README.md
    microbit-driver/README.md
    microbit-web/README.md
    legacy-gc-gpio/README.md
    legacy-gc-i2c/README.md
    remote/README.md
    pre-arranged/README.md
```

- `metadata.md` は Example 管理用メタデータ（platform 別 upstream、推奨 Example、移行メモ）
- `README.md` は device ディレクトリの概要（platform 一覧、`metadata.md` へのリンク）
- `platforms/<platform>/README.md` は platform 別 Example の概要（upstream、状態、`src/` 追加の案内）
- 商品リンク・商品画像・回路図・データシートは [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) を正とし、本 repo では正本として持たない
- `--name` はデバイス名 / 型番および見出しに反映する
- `--dashboard-url` は `Device Dashboard` 行に反映する（未指定時は空欄）
- `src/` ディレクトリは初期生成しない

## deviceId のルール

- 小文字英数字
- ハイフン使用可
- アンダースコアは不可
- 空文字不可

許可例: `adt7410`, `bme280`, `pca9685`, `vl53l0x`, `ads1115-loadcell`

拒否例: `ADT7410`, `BME280`, `i2c_ADT7410`

既に `examples/devices/<device-id>/` が存在する場合はエラーにし、上書きしません。

## ファイル構成

```txt
tools/create-device/
  README.md
  src/
    main.ts
    platform-definitions.ts
    render-device-readme.ts
    render-metadata.ts
    render-platform-readme.ts
    validate-device-id.ts
    write-file-if-not-exists.ts
```
