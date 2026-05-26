# Contributing

CHIRIMEN Example Catalog へのコントリビューションありがとうございます。

このリポジトリでは、CHIRIMEN 関連リポジトリに散在している Example を整理し、デバイス別に探しやすくすることを目的としています。

## 責務分離

| リポジトリ | 役割 |
| --- | --- |
| [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) | デバイス情報の正本（商品リンク・画像・回路図・データシート・カテゴリ・タグ等） |
| **本リポジトリ** | Example 情報の正本（platform 別 Example・upstream・状態・実機確認・移行メモ） |

## 基本方針

`examples/devices/<device-id>/metadata.md` を一次情報として扱います。

新しいデバイスを追加する場合は、`METADATA_TEMPLATE.md` をコピーして `metadata.md` を作成してください。

## 新しいデバイスを追加する場合

1. `examples/devices/<device-id>/` を作成する
2. `METADATA_TEMPLATE.md` をコピーして `metadata.md` を作成する
3. Device ID・型番・Device Dashboard URL を記入する
4. 分かる範囲で Platform 別 Example 一覧を記入する
5. 実機確認していない場合は `未確認` のままにする

## デバイス情報の更新

商品リンク・商品イメージ・回路図・データシート・カテゴリ・タグ・説明は [chirimen-device-dashboard](https://github.com/gurezo/chirimen-device-dashboard) で更新してください。

## 空欄でよい項目

以下は、分からない場合は空欄で構いません。

- 存在しない platform の行
- 確認日・確認者（未確認の場合）

## CI について

以下は error として扱います。

- `metadata.md` の必須見出しがない
- Markdown の表構造が壊れている
- 未定義の Platform 名が使われている

以下は warning として扱います。

- Device Dashboard リンクが空
- 実機確認が未確認

## Platform 名

Platform 名は以下のいずれかを使用してください。

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

## 実機確認について

実機確認していないサンプルは、無理に `確認済み` にしないでください。

未確認の場合は、以下のように記入します。

```md
| 実機確認 | 未確認 |
```

確認済みの場合は、確認日と確認者も記入してください。

```md
| 実機確認 | 確認済み |
| 確認日 | 2026-05-25 |
| 確認者 | @your-github-id |
```

## Pull Request

Pull Request では、変更内容と対象デバイスを簡単に記入してください。

分からない項目が残っていても構いません。  
まずは情報を集め、少しずつ整理していくことを重視します。
