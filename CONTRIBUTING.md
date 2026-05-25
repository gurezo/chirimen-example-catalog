# Contributing

CHIRIMEN Example Catalog へのコントリビューションありがとうございます。

このリポジトリでは、CHIRIMEN 関連リポジトリに散在している Example を整理し、デバイス別に探しやすくすることを目的としています。

## 基本方針

このリポジトリでは、`metadata.md` を一次情報として扱います。

```txt
examples/devices/<device-id>/metadata.md
```

新しいデバイスを追加する場合は、`METADATA_TEMPLATE.md` をコピーして `metadata.md` を作成してください。

## 新しいデバイスを追加する場合

1. `examples/devices/<device-id>/` を作成する
2. `METADATA_TEMPLATE.md` をコピーして `metadata.md` を作成する
3. 分かる範囲で基本情報を記入する
4. 商品リンク、商品イメージ、回路図、データシートを分かる範囲で記入する
5. サンプルコードの URL を追加する
6. 実機確認していない場合は `未確認` のままにする

## 空欄でよい項目

以下は、分からない場合は空欄で構いません。

- 商品イメージ
- 回路図
- データシート
- 製造元資料
- アプリケーションノート
- 仕様書
- 説明書
- ガイド
- 確認日
- 確認者

## CI について

このリポジトリの CI は、参加しやすさを優先しています。

以下は error として扱います。

- `metadata.md` の必須見出しがない
- Markdown の表構造が壊れている
- 未定義の Platform 名が使われている

以下は warning として扱います。

- 商品リンクが空
- 商品イメージが空
- 回路図が空
- データシートが空
- 実機確認が未確認

## Platform 名

Platform 名は以下のいずれかを使用してください。

| Platform | 説明 |
|---|---|
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
