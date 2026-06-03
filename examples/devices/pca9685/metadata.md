# Example メタデータ: PCA9685

## 基本情報

| 項目 | 内容 |
|---|---|
| Device ID | `pca9685` |
| デバイス名 / 型番 | `PCA9685` |
| Device Dashboard | `https://chirimen-device-dashboard.web.app/devices/pca9685` |
| 備考 | デバイス本体の情報、商品リンク、商品画像、回路図、データシートは chirimen-device-dashboard を正とする |

## Platform 別 Example

| Platform | Local Path | Upstream Repository | Upstream Path | 状態 | 備考 |
|---|---|---|---|---|---|
| pizero-esm | `platforms/pizero-esm/` | `chirimen-oh/chirimen.org` | `pizero/src/esm-examples/pca9685` | primary | 現行候補 |
| raspi-node | `platforms/raspi-node/` | `chirimen-oh/chirimen-drivers` | `raspi-examples/pca9685` | legacy | 参照用 |
| node | `platforms/node/` | `chirimen-oh/chirimen-drivers` | `node-examples/pca9685` | legacy | 参照用 |
| legacy-gc-i2c | `platforms/legacy-gc-i2c/` | `chirimen-oh/chirimen` | `gc/i2c/i2c-PCA9685` | archive | 旧構成 |

## 推奨 Example

| 項目 | 内容 |
|---|---|
| 推奨 Platform | `pizero-esm` |
| 推奨理由 | CHIRIMEN Pi Zero 向けの現行 ESM example として扱うため |
| 実機確認 | 未確認 |
| 確認日 |  |
| 確認者 |  |

## 移行メモ

- 同じ PCA9685 の Example が複数リポジトリに存在するため、対応関係を整理する。
- 旧 `gc/i2c` のサンプルは archive 扱いとする。
- platform 別 `src/` の同期は MVP 後に段階的に追加する。
- デバイス本体の情報は [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) を参照する。
