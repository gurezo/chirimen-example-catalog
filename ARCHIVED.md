# アーカイブについて

本リポジトリ（`chirimen-example-catalog`）は **アーカイブ済み（読み取り専用）** です。

## アーカイブ理由

[chirimen-device-dashboard #177](https://github.com/gurezo/chirimen-device-dashboard/issues/177) にて、本リポジトリで整理していた Platform 別 Example 管理機能が `chirimen-device-dashboard` へ移植されました。

本リポジトリの役割（移行元・検証用）は完了したため、[Issue #86](https://github.com/gurezo/chirimen-example-catalog/issues/86) に基づきアーカイブします。

## 移行先

| 項目 | 移行先 |
| --- | --- |
| Platform 別 Example の正本 | [`data/platform-examples/platform-examples.json`](https://github.com/gurezo/chirimen-device-dashboard/blob/main/data/platform-examples/platform-examples.json) |
| 編集手順 | [`data/platform-examples/README.md`](https://github.com/gurezo/chirimen-device-dashboard/blob/main/data/platform-examples/README.md) |
| 公開 UI | [chirimen-device-dashboard](https://chirimen-device-dashboard.web.app/) |
| リポジトリ | [gurezo/chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) |

## 本リポジトリの扱い

- 既存の `examples/devices/**/metadata.md`、`catalog/*.json`、`generated/` は参照用として保持します
- 新規の Issue・Pull Request・コントリビューションは受け付けません
- `chirimen-device-dashboard` は本リポジトリを runtime dependency として参照しません

## 関連 Issue

- [chirimen-example-catalog #86 — アーカイブ](https://github.com/gurezo/chirimen-example-catalog/issues/86)
- [chirimen-device-dashboard #177 — Example 管理機能の移植](https://github.com/gurezo/chirimen-device-dashboard/issues/177)
