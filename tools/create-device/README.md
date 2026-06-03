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

## deviceId のルール

- 小文字英数字
- ハイフン使用可
- アンダースコアは不可
- 空文字不可

許可例: `adt7410`, `bme280`, `pca9685`, `vl53l0x`, `ads1115-loadcell`

拒否例: `ADT7410`, `BME280`, `i2c_ADT7410`

## 現時点のスコープ

Issue #47 時点では、CLI 引数の解析・`deviceId` 検証・既存ディレクトリの上書き防止・後続処理向け `CreateDeviceContext` の構築までを行います。

`metadata.md` や README の生成は後続 issue (#48 以降) で実装します。

## ファイル構成

```txt
tools/create-device/
  README.md
  src/
    main.ts
    validate-device-id.ts
    write-file-if-not-exists.ts
```

`write-file-if-not-exists.ts` は、後続 issue でファイル生成する際に利用する非上書き書き込みユーティリティです。
