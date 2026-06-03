import { requestI2CAccess } from "./node_modules/node-web-i2c/index.js";
import M5HX711 from "./m5hx711.js";
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

main();

async function main() {
    const i2cAccess = await requestI2CAccess();
    const port = i2cAccess.ports.get(1);
    const m5hx711 = new M5HX711(port, 0x26);
    await m5hx711.init();

    console.log("=== M5 Scale Unit 公式キャリブレーション ===");
    console.log("M5Stack仕様書に従った正しいキャリブレーション\n");
    
    // 既知の重量を指定（100gを推奨）
    const knownWeight = 100; // ← 実際の重量に変更
    
    // フルキャリブレーション実行
    await m5hx711.fullCalibration(knownWeight);
    
    console.log("\n測定を開始します...\n");
    
    // 測定開始
    while (true) {
        const adc = await m5hx711.getRawADC();
        const weight = await m5hx711.getWeight(); // ファームウェアが計算した重量
        
        console.log(`ADC: ${adc.toString().padStart(8)}, 重量: ${weight.toFixed(1).padStart(7)} g`);
        
        await sleep(500);
    }
}
