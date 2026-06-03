// @ts-check
// Unit-Mini Scales (https://docs.m5stack.com/ja/unit/Unit-Mini%20Scales)
// HX711 with STM32 unit driver for CHIRIMEN
// Weight Scale I2C Sensor
// Based on UNIT_SCALES Arduino library

/** @param {number} ms Delay for a number of milliseconds. */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

var M5HX711 = function (i2cPort, slaveAddress) {
    if (!slaveAddress) {
        slaveAddress = 0x26;
    }
    this.i2cPort = i2cPort;
    this.i2cSlave = null;
    this.slaveAddress = slaveAddress;
}

M5HX711.prototype = {
    init: async function () {
        this.i2cSlave = await this.i2cPort.open(this.slaveAddress);
        await sleep(100);
    },
    
    // ========================================
    // ヘルパー関数
    // ========================================
    
    // 32bit符号なし整数を符号付きに変換
    _toSigned32: function(unsigned) {
        if (unsigned > 0x7FFFFFFF) {
            return unsigned - 0x100000000;
        }
        return unsigned;
    },
    
    // 4バイトを32bit整数に変換（リトルエンディアン）
    _bytes4ToInt32: function(bytes) {
        var unsigned = (bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24)) >>> 0;
        return this._toSigned32(unsigned);
    },
    
    // 4バイトをfloatに変換（リトルエンディアン、IEEE 754）
    _bytes4ToFloat: function(bytes) {
        var buffer = new ArrayBuffer(4);
        var view = new DataView(buffer);
        // リトルエンディアンで書き込む
        view.setUint8(0, bytes[0]);
        view.setUint8(1, bytes[1]);
        view.setUint8(2, bytes[2]);
        view.setUint8(3, bytes[3]);
        // リトルエンディアンでfloatとして読み取る
        return view.getFloat32(0, true);
    },
    
    // floatを4バイト配列に変換（リトルエンディアン、IEEE 754）
    _floatToBytes4: function(value) {
        var buffer = new ArrayBuffer(4);
        var view = new DataView(buffer);
        // リトルエンディアンでfloatとして書き込む
        view.setFloat32(0, value, true);
        // バイト配列として返す
        return [
            view.getUint8(0),
            view.getUint8(1),
            view.getUint8(2),
            view.getUint8(3)
        ];
    },
    
    // ========================================
    // メイン機能
    // ========================================
    
    // 生のADC値を取得 (0x00)
    getRawADC: async function() {
        await this.i2cSlave.writeByte(0x00);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(4);
        var adc = this._bytes4ToInt32(data);
        return adc;
    },
    
    // キャリブレーション済み重量を取得 (float, グラム) (0x10)
    getWeight: async function() {
        await this.i2cSlave.writeByte(0x10);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(4);
        var weight = this._bytes4ToFloat(data);
        return weight;
    },
    
    // キャリブレーション済み重量を取得 (int32, グラム×100) (0x60)
    getWeightInt: async function() {
        await this.i2cSlave.writeByte(0x60);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(4);
        var weight100 = this._bytes4ToInt32(data);
        return weight100;
    },
    
    // 重量を文字列として取得 (0x70)
    getWeightString: async function() {
        await this.i2cSlave.writeByte(0x70);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(16);
        // null終端文字列として解釈
        var str = "";
        for (var i = 0; i < 16 && data[i] !== 0; i++) {
            str += String.fromCharCode(data[i]);
        }
        return str;
    },
    
    // ========================================
    // オフセット（ギャップ）関連
    // ========================================
    
    // 現在のオフセット値を取得 (float, グラム) (0x40)
    getGapValue: async function() {
        await this.i2cSlave.writeByte(0x40);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(4);
        var gap = this._bytes4ToFloat(data);
        console.log("getGapValue:", gap, "g");
        return gap;
    },
    
    // オフセット値を設定 (float, グラム) (0x40)
    setGapValue: async function(offset) {
        var bytes = this._floatToBytes4(offset);
        var wdata = [0x40].concat(bytes);
        await this.i2cSlave.writeBytes(wdata);
        await sleep(100); // Arduinoコードに合わせて100ms待機
        console.log("setGapValue:", offset, "g");
    },
    
    // 現在の値をオフセットとして設定（ゼロ点調整） (0x50)
    // 注意: このメソッドはファームウェアに現在のADC値を
    // オフセットとして記憶させます
    setOffset: async function() {
        var wdata = [0x50, 0x01]; // レジスタ0x50に1を書き込む
        await this.i2cSlave.writeBytes(wdata);
        await sleep(100);
        console.log("setOffset completed (zero calibration)");
    },
    
    // ゼロ点調整
    // 現在の重量を読み取り、それを打ち消すオフセットを設定
    calibrateZero: async function() {
        // 現在の重量を読み取る
        var currentWeight = await this.getWeight();
        console.log("Current weight before calibration:", currentWeight, "g");
        
        // 現在のオフセットを取得
        var currentOffset = await this.getGapValue();
        console.log("Current offset:", currentOffset, "g");
        
        // 新しいオフセット = 現在のオフセット + 現在の重量
        // これにより、現在の状態が0gになる
        var newOffset = currentOffset + currentWeight;
        
        await this.setGapValue(newOffset);
        console.log("New offset set to:", newOffset, "g");
        console.log("Zero calibration completed");
        
        // 確認のため再度読み取り
        await sleep(100);
        var checkWeight = await this.getWeight();
        console.log("Weight after calibration:", checkWeight, "g (should be near 0)");
    },
    
    // オフセットをクリア
    clearGap: async function() {
        await this.setGapValue(0.0);
        console.log("clearGap completed");
    },
    
    // ========================================
    // その他の機能
    // ========================================
    
    // ボタン状態取得 (0x20)
    getButtonStatus: async function() {
        await this.i2cSlave.writeByte(0x20);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(1);
        return data[0];
    },
    
    // LED色設定 (0x30) - RGB各0-255
    setLEDColor: async function(r, g, b) {
        var wdata = [0x30, r & 0xFF, g & 0xFF, b & 0xFF];
        await this.i2cSlave.writeBytes(wdata);
        await sleep(10);
    },
    
    // LED色設定 (16進数カラーコード)
    setLEDColorHex: async function(colorHex) {
        var r = (colorHex >> 16) & 0xFF;
        var g = (colorHex >> 8) & 0xFF;
        var b = colorHex & 0xFF;
        await this.setLEDColor(r, g, b);
    },
    
    // LED色取得 (0x30)
    getLEDColor: async function() {
        await this.i2cSlave.writeByte(0x30);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(3);
        var colorHex = (data[0] << 16) | (data[1] << 8) | data[2];
        return colorHex;
    },
    
    // フィルター設定 (0x80, 0x81, 0x82)
    setLPFilter: async function(enable) {
        var wdata = [0x80, enable ? 1 : 0];
        await this.i2cSlave.writeBytes(wdata);
        await sleep(10);
    },
    
    getLPFilter: async function() {
        await this.i2cSlave.writeByte(0x80);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(1);
        return data[0];
    },
    
    setAvgFilter: async function(avg) {
        var wdata = [0x81, avg & 0xFF];
        await this.i2cSlave.writeBytes(wdata);
        await sleep(10);
    },
    
    getAvgFilter: async function() {
        await this.i2cSlave.writeByte(0x81);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(1);
        return data[0];
    },
    
    setEmaFilter: async function(ema) {
        var wdata = [0x82, ema & 0xFF];
        await this.i2cSlave.writeBytes(wdata);
        await sleep(10);
    },
    
    getEmaFilter: async function() {
        await this.i2cSlave.writeByte(0x82);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(1);
        return data[0];
    },
    
    // ファームウェアバージョン取得 (0xFE)
    getFirmwareVersion: async function() {
        await this.i2cSlave.writeByte(0xFE);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(1);
        return data[0];
    },
    
    // I2Cアドレス取得 (0xFF)
    getI2CAddress: async function() {
        await this.i2cSlave.writeByte(0xFF);
        await sleep(10);
        var data = await this.i2cSlave.readBytes(1);
        return data[0];
    },
    
    // I2Cアドレス設定 (0xFF)
    setI2CAddress: async function(newAddr) {
        var wdata = [0xFF, newAddr & 0xFF];
        await this.i2cSlave.writeBytes(wdata);
        await sleep(10);
        // 新しいアドレスで再接続
        this.slaveAddress = newAddr;
        await this.init();
    },
    
    // ========================================
    // 便利なメソッド
    // ========================================
    
    // すべてのデータを読み取る
    readData: async function() {
        var adc = await this.getRawADC();
        var weight = await this.getWeight();
        var weightInt = await this.getWeightInt();
        
        console.log({
            adc: adc,
            weight: weight,
            weightInt: weightInt,
            weightFromInt: weightInt / 100.0
        });
        
        return {
            adc: adc,
            weight: weight,
            weightInt: weightInt
        };
    },
    
    // ========================================
    // 手動キャリブレーション用メソッド
    // ========================================
    
    // 完全キャリブレーション（M5Stack仕様書に従った方法）
    // 手順:
    // 1. 何も載せずに setOffset() を実行（RawADC_0g を記録）
    // 2. 既知の重量（例: 100g）を載せて fullCalibration() を実行
    fullCalibration: async function(knownWeight) {
        if (!knownWeight || knownWeight <= 0) {
            throw new Error("Please specify known weight in grams");
        }
        
        console.log(`\n=== フルキャリブレーション開始 ===`);
        console.log(`既知の重量: ${knownWeight}g\n`);
        
        // Step 1: Offsetをリセット
        console.log("Step 1: Offsetをクリア中...");
        await this.setGapValue(0.0); // GAPを一旦クリア
        await sleep(100);
        
        // Step 2: 無荷重時のADC値を取得（setOffsetで記録）
        console.log("Step 2: 無荷重時の基準値を記録中...");
        console.log("【重要】何も載せていない状態にしてください");
        await sleep(3000);
        
        let rawADC_0g = 0;
        for (let i = 0; i < 10; i++) {
            rawADC_0g += await this.getRawADC();
            await sleep(50);
        }
        rawADC_0g = Math.round(rawADC_0g / 10);
        console.log(`  無荷重ADC平均: ${rawADC_0g}`);
        
        // setOffsetを実行して基準点を設定
        await this.setOffset();
        await sleep(200);
        
        // Step 3: 既知の重量を載せてADC値を取得
        console.log(`\nStep 3: ${knownWeight}g を載せてください...`);
        await sleep(5000);
        
        let rawADC_known = 0;
        for (let i = 0; i < 10; i++) {
            rawADC_known += await this.getRawADC();
            await sleep(50);
        }
        rawADC_known = Math.round(rawADC_known / 10);
        console.log(`  荷重時ADC平均: ${rawADC_known}`);
        
        // Step 4: GAP値を計算
        // GAP = (RawADC_known - RawADC_0g) / knownWeight
        let adcDiff = rawADC_known - rawADC_0g;
        let gap = adcDiff / knownWeight;
        
        console.log(`\nStep 4: GAP計算`);
        console.log(`  ADC差分: ${adcDiff}`);
        console.log(`  GAP = ${adcDiff} / ${knownWeight} = ${gap}`);
        
        // GAP値を書き込む（レジスタ 0x40）
        await this.setGapValue(gap);
        await sleep(200);
        
        // 確認
        let verifyGap = await this.getGapValue();
        console.log(`  書き込み確認: GAP = ${verifyGap}`);
        
        console.log(`\n✓ キャリブレーション完了！`);
        console.log(`=`.repeat(40));
        
        return {
            rawADC_0g: rawADC_0g,
            rawADC_known: rawADC_known,
            gap: gap
        };
    },
    
    // 簡易キャリブレーション（従来版）
    simpleCalibrate: async function(zeroADC, knownWeight, knownADC) {
        this.calibrationZeroADC = zeroADC;
        this.calibrationScale = knownWeight / (knownADC - zeroADC);
        console.log("Calibration data saved:");
        console.log("  Zero ADC:", this.calibrationZeroADC);
        console.log("  Scale:", this.calibrationScale, "g per ADC");
    },
    
    // キャリブレーションデータを使って重量計算
    getWeightCalibrated: async function() {
        if (!this.calibrationZeroADC || !this.calibrationScale) {
            throw new Error("Please run simpleCalibrate() first");
        }
        var adc = await this.getRawADC();
        var weight = (adc - this.calibrationZeroADC) * this.calibrationScale;
        return weight;
    }
};

export default M5HX711;
