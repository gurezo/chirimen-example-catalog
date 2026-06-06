# Contributing

> **アーカイブ済み（読み取り専用）**  
> 本リポジトリは新規のコントリビューションを受け付けていません。  
> Platform 別 Example の更新は [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) の [`data/platform-examples/`](https://github.com/gurezo/chirimen-device-dashboard/blob/main/data/platform-examples/README.md) で行ってください。  
> 詳細は [ARCHIVED.md](ARCHIVED.md) を参照してください。

## 移行先

| 更新内容 | 移行先 |
| --- | --- |
| Platform 別 Example | [chirimen-device-dashboard `data/platform-examples/`](https://github.com/gurezo/chirimen-device-dashboard/blob/main/data/platform-examples/README.md) |
| 商品リンク・画像・回路図・データシート・カテゴリ・タグ | [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) |
| 公開 UI | [chirimen-device-dashboard.web.app](https://chirimen-device-dashboard.web.app/) |

## Pull Request

本リポジトリはアーカイブ済みのため、Pull Request は受け付けていません。

## 履歴（アーカイブ前の方針）

以下はアーカイブ前のコントリビューション方針です。参照用として残しています。

### 責務分離（移行前）

| リポジトリ | 役割 |
| --- | --- |
| [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) | デバイス情報の正本（商品リンク・画像・回路図・データシート・カテゴリ・タグ等） |
| **本リポジトリ** | Example 情報の正本（platform 別 Example・upstream・状態・実機確認・移行メモ） |

### 基本方針（移行前）

`examples/devices/<device-id>/metadata.md` を一次情報として扱いました。

新しいデバイスを追加する場合は、`METADATA_TEMPLATE.md` をコピーして `metadata.md` を作成していました。

### Platform 名（移行前）

| Platform | 説明 |
| --- | --- |
| `pizero-esm` | CHIRIMEN Pi Zero ESM examples |
| `raspi-node` | Raspberry Pi / Node.js examples |
| `node` | Node.js examples |
| `microbit-driver` | chirimen-drivers 側の micro:bit examples |
| `microbit-web` | chirimen-micro-bit examples |
| `legacy-gc-gpio` | 旧 CHIRIMEN GPIO examples |
| `legacy-gc-i2c` | 旧 CHIRIMEN I2C examples |
| `remote` | remote-connection examples |
| `pre-arranged` | pre-arrangement-contributions |
