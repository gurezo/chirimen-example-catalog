import { requestI2CAccess } from "node-web-i2c";
import I2CLCD from "./i2clcd.js";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const lcd = new I2CLCD(port, 0x27); // アドレスが違う場合は 0x3f 等に変更

  await lcd.init();

  while (true) {
    await lcd.print("Hello Node.js!", lcd.line1); // 1行目
    await lcd.print("I2C LCD 1602", lcd.line2);   // 2行目
    await new Promise(r => setTimeout(r, 1500));

    await lcd.print("コンニチハ ラズパイ", lcd.line1); // 全角カタカナ
    await lcd.print("ｵﾊﾖｳｺﾞｻﾞｲﾏｽ", lcd.line2); // 半角カタカナ
    await sleep(1500);
  }
}

main().catch(console.error);
