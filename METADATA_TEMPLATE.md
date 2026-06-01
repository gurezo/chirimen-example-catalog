# Example メタデータ: <デバイス名>

## 基本情報

| 項目 | 内容 |
|---|---|
| Device ID | `<例: adt7410>` |
| デバイス名 / 型番 | `<例: ADT7410>` |
| Device Dashboard | `<chirimen-device-dashboard 側の該当ページ URL>` |
| 備考 | デバイス本体の情報、商品リンク、商品画像、回路図、データシートは chirimen-device-dashboard を正とする |

## Platform 別 Example

| Platform | Local Path | Upstream Repository | Upstream Path | 状態 | 備考 |
|---|---|---|---|---|---|
| pizero-esm | `platforms/pizero-esm/` | `chirimen-oh/chirimen.org` | `pizero/src/esm-examples/<device-id>` | primary | 現行候補 |
| raspi-node | `platforms/raspi-node/` | `chirimen-oh/chirimen-drivers` | `raspi-examples/<device-id>` | legacy | 参照用 |
| node | `platforms/node/` | `chirimen-oh/chirimen-drivers` | `node-examples/<device-id>` | legacy | 参照用 |
| microbit-driver | `platforms/microbit-driver/` | `chirimen-oh/chirimen-drivers` | `microbit-examples/<device-id>` | legacy | 参照用 |
| microbit-web | `platforms/microbit-web/` | `chirimen-oh/chirimen-micro-bit` | `examples/<device-id>` | legacy | 参照用 |
| legacy-gc-gpio | `platforms/legacy-gc-gpio/` | `chirimen-oh/chirimen` | `gc/gpio/<device-id>` | archive | 旧構成 |
| legacy-gc-i2c | `platforms/legacy-gc-i2c/` | `chirimen-oh/chirimen` | `gc/i2c/<device-id>` | archive | 旧構成 |
| remote | `platforms/remote/` | `chirimen-oh/remote-connection` | `examples/<device-id>` | special | 特殊用途 |
| pre-arranged | `platforms/pre-arranged/` | `chirimen-oh/pre-arrangement-contributions` | `<device-id>` | incubator | 整理前 |

## 推奨 Example

| 項目 | 内容 |
|---|---|
| 推奨 Platform | `<例: pizero-esm>` |
| 推奨理由 | `<例: CHIRIMEN Pi Zero 向けの現行 ESM example として扱うため>` |
| 実機確認 | `未確認` |
| 確認日 |  |
| 確認者 |  |

## 移行メモ

- 同じデバイスの Example が複数リポジトリに存在する場合、このファイルで対応関係を整理する。
- このリポジトリでは Example の所在、状態、platform 差分、upstream との対応関係を管理する。
- デバイス本体の情報、商品リンク、商品画像、回路図、データシートは chirimen-device-dashboard を参照する。
