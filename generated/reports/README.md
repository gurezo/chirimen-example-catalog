# generated/reports

このディレクトリには、CHIRIMEN Example Catalog の自動生成レポートを配置します。

## 主なレポート

| ファイル                           | 内容                                                                |
| ---------------------------------- | ------------------------------------------------------------------- |
| `duplicated-devices.md`            | 同じ Device ID に複数 platform / upstream の Example が存在するもの |
| `missing-metadata.md`              | metadata.md が不足している Example                                  |
| `missing-device-dashboard-link.md` | chirimen-device-dashboard への参照が不足しているデバイス            |
| `deprecated-examples.md`           | legacy / archive 扱いの Example                                     |
| `sync-summary.md`                  | upstream 同期結果                                                   |

## 注意

このディレクトリ配下の Markdown は、基本的に tools から生成されます。

手動編集した内容は、再生成時に上書きされる可能性があります。
