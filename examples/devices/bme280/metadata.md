# Example メタデータ: BME280

## 基本情報

| 項目 | 内容 |
|---|---|
| Device ID | `bme280` |
| デバイス名 / 型番 | `BME280` |
| Device Dashboard | `https://chirimen-device-dashboard.web.app/devices/bme280` |
| 備考 | デバイス本体の情報、商品リンク、商品画像、回路図、データシートは chirimen-device-dashboard を正とする |

## Platform 別 Example

| Platform | Local Path | Upstream Repository | Upstream Path | 状態 | 備考 |
|---|---|---|---|---|---|
| pizero-esm | `platforms/pizero-esm/` | `chirimen-oh/chirimen.org` | `pizero/src/esm-examples/bme280` | primary | 現行候補 |
| raspi-node | `platforms/raspi-node/` | `chirimen-oh/chirimen-drivers` | `raspi-examples/bme280` | legacy | 参照用 |
| node | `platforms/node/` | `chirimen-oh/chirimen-drivers` | `node-examples/bme280` | legacy | 参照用 |

## 推奨 Example

| 項目 | 内容 |
|---|---|
| 推奨 Platform | `pizero-esm` |
| 推奨理由 | CHIRIMEN Pi Zero 向けの現行 ESM example として扱うため |
| 実機確認 | 未確認 |
| 確認日 |  |
| 確認者 |  |

## 移行メモ

- 同じ BME280 の Example が複数リポジトリに存在するため、対応関係を整理する。
- platform 別 `src/` の同期は MVP 後に段階的に追加する。
- デバイス本体の情報は [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) を参照する。
