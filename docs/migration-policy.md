# 移行ポリシー

CHIRIMEN 関連リポジトリに散在している Example を整理するための方針です。

## 責務分離

- **chirimen-device-dashboard**: デバイス情報の正本および Platform 別 Example の正本
- **chirimen-example-catalog**（本 repo）: **アーカイブ済み** — 移行元・参照用

[chirimen-device-dashboard #177](https://github.com/gurezo/chirimen-device-dashboard/issues/177) の完了に伴い、Platform 別 Example 管理は device-dashboard へ移行しました。デバイス本体の商品情報・回路図・Platform 別 Example の更新は device-dashboard を参照してください。

## 基本方針

既存リポジトリを置き換えません。散在する Example を収集・分類・比較し、primary / legacy / archive / special / incubator を可視化します。

## 優先順位

| 優先度 | 種別 | Platform | 対象 |
|---|---|---|---|
| 1 | primary | `pizero-esm` | `chirimen.org/pizero/src/esm-examples` |
| 2 | legacy | `raspi-node` | `chirimen-drivers/raspi-examples` |
| 3 | legacy | `node` | `chirimen-drivers/node-examples` |
| 4 | legacy | `microbit-driver` | `chirimen-drivers/microbit-examples` |
| 5 | legacy | `microbit-web` | `chirimen-micro-bit/examples` |
| 6 | archive | `legacy-gc-gpio`, `legacy-gc-i2c` | `chirimen/gc/gpio`, `chirimen/gc/i2c` |
| 7 | incubator | `pre-arranged` | `pre-arrangement-contributions` |
| 8 | special | `remote` | `remote-connection/examples` |

## primary / legacy / archive / incubator / special

| 状態 | 意味 |
|---|---|
| primary | 現行候補 |
| legacy | 参照用の旧サンプル |
| archive | 旧構成として保存 |
| special | 特殊用途 |
| incubator | 整理前・検討中 |

実機確認していないサンプルは推奨扱いにしない。

## Device Dashboard との連携

各 `metadata.md` には Device Dashboard の URL を記載し、デバイス詳細はそちらを参照します。

## 実機確認

推奨 Example にする場合は、確認日・確認者・使用 platform・使用デバイスを記録します。
