/**
 * I2C 1602 LCD with PCF8574 Driver for node-webi2c
 * Note: VCCは5Vを入れないとLCDのコントラストが低い場合がある
 *       LEDジャンパーは付けておく
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const I2CLCD = function (i2cPort, slaveAddress = 0x27) {
    this.i2cPort = i2cPort;
    this.slaveAddress = slaveAddress;
    this.i2cSlave = null;
    this.line1 = 0x80;
    this.line2 = 0xC0;

    // Constants
    this.LCD_CHR = 1; // Mode - Sending data
    this.LCD_CMD = 0; // Mode - Sending command
    this.LCD_BACKLIGHT = 0x08; // On (Off is 0x00)
    this.ENABLE = 0b00000100; // Enable bit
};

I2CLCD.prototype = {
    init: async function () {
        this.i2cSlave = await this.i2cPort.open(this.slaveAddress);

        // 初期化シーケンス
        await this.lcdByte(0x33, this.LCD_CMD);
        await this.lcdByte(0x32, this.LCD_CMD);
        await this.lcdByte(0x06, this.LCD_CMD); // カーソルの移動方向
        await this.lcdByte(0x0C, this.LCD_CMD); // 表示ON, カーソルOFF
        await this.lcdByte(0x28, this.LCD_CMD); // 4bitモード, 2行表示
        await this.lcdByte(0x01, this.LCD_CMD); // クリア
        await sleep(1); // 完了待ち
    },

    lcdByte: async function (bits, mode) {
        // 高位4ビットと低位4ビットに分けて送信する (4bitモード)
        const high = mode | (bits & 0xF0) | this.LCD_BACKLIGHT;
        const low = mode | ((bits << 4) & 0xF0) | this.LCD_BACKLIGHT;

        // High bits
        await this.i2cSlave.writeByte(high);
        await this.lcdToggleEnable(high);

        // Low bits
        await this.i2cSlave.writeByte(low);
        await this.lcdToggleEnable(low);
    },

    lcdToggleEnable: async function (bits) {
        // E(Enable)ピンをパルスさせてデータを確定させる
        await sleep(0.5);
        await this.i2cSlave.writeByte(bits | this.ENABLE);
        await sleep(0.5);
        await this.i2cSlave.writeByte(bits & ~this.ENABLE);
        await sleep(0.5);
    },

    /**
     * カタカナ対応のプリントメソッド
     * @param {string} text - 表示したい文字列（全角・半角カタカナ混在OK）
     * @param {number} line - 行アドレス (0x80 or 0xC0)
     */
    print: async function (text, line = 0x80) {
        await this.lcdByte(line, this.LCD_CMD);

        // カタカナ変換マップ（全角 -> 半角コード + 濁点/半濁点）
        const kanaMap = {
            'ガ': [0xB6, 0xDE], 'ギ': [0xB7, 0xDE], 'グ': [0xB8, 0xDE], 'ゲ': [0xB9, 0xDE], 'ゴ': [0xBA, 0xDE],
            'ザ': [0xBB, 0xDE], 'ジ': [0xBC, 0xDE], 'ズ': [0xBD, 0xDE], 'ゼ': [0xBE, 0xDE], 'ゾ': [0xBF, 0xDE],
            'ダ': [0xC0, 0xDE], 'ヂ': [0xC1, 0xDE], 'ヅ': [0xC2, 0xDE], 'デ': [0xC3, 0xDE], 'ド': [0xC4, 0xDE],
            'バ': [0xCA, 0xDE], 'ビ': [0xCB, 0xDE], 'ブ': [0xCC, 0xDE], 'ベ': [0xCD, 0xDE], 'ボ': [0xCE, 0xDE],
            'パ': [0xCA, 0xDF], 'ピ': [0xCB, 0xDF], 'プ': [0xCC, 0xDF], 'ペ': [0xCD, 0xDF], 'ポ': [0xCE, 0xDF],
            'ア': [0xB1], 'イ': [0xB2], 'ウ': [0xB3], 'エ': [0xB4], 'オ': [0xB5],
            'カ': [0xB6], 'キ': [0xB7], 'ク': [0xB8], 'ケ': [0xB9], 'コ': [0xBA],
            'サ': [0xBB], 'シ': [0xBC], 'ス': [0xBD], 'セ': [0xBE], 'ソ': [0xBF],
            'タ': [0xC0], 'チ': [0xC1], 'ツ': [0xC2], 'テ': [0xC3], 'ト': [0xC4],
            'ナ': [0xC5], 'ニ': [0xC6], 'ヌ': [0xC7], 'ネ': [0xC8], 'ノ': [0xC9],
            'ハ': [0xCA], 'ヒ': [0xCB], 'フ': [0xCC], 'ヘ': [0xCD], 'ホ': [0xCE],
            'マ': [0xCF], 'ミ': [0xD0], 'ム': [0xD1], 'メ': [0xD2], 'モ': [0xD3],
            'ヤ': [0xD4], 'ユ': [0xD5], 'ヨ': [0xD6],
            'ラ': [0xD7], 'リ': [0xD8], 'ル': [0xD9], 'レ': [0xDA], 'ロ': [0xDB],
            'ワ': [0xDC], 'ヲ': [0xA6], 'ン': [0xDD],
            'ッ': [0xAF], 'ャ': [0xAC], 'ュ': [0xAD], 'ョ': [0xAE],
            'ァ': [0xA7], 'ィ': [0xA8], 'ゥ': [0xA9], 'ェ': [0xAA], 'ォ': [0xAB],
            'ー': [0xB0], '゛': [0xDE], '゜': [0xDF], '。': [0xA1], '「': [0xA2], '」': [0xA3], '、': [0xA4], '・': [0xA5]
        };

        let buffer = [];
        // 1文字ずつループしてLCD用コードに変換
        for (const char of text) {
            if (kanaMap[char]) {
                // マップにある全角カタカナ
                buffer.push(...kanaMap[char]);
            } else {
                const code = char.charCodeAt(0);
                if (code >= 0xFF61 && code <= 0xFF9F) {
                    // すでに半角カタカナ(Unicode)の場合、JIS X 0201に変換
                    buffer.push(code - 0xFEC0);
                } else if (code < 128) {
                    // 英数字
                    buffer.push(code);
                } else {
                    // 対応外の文字はスペース
                    buffer.push(0x20);
                }
            }
        }

        // 16文字分だけ送信（はみ出し禁止）
        for (let i = 0; i < 16; i++) {
            const byte = buffer[i] !== undefined ? buffer[i] : 0x20; // 足りない分はスペース
            await this.lcdByte(byte, this.LCD_CHR);
        }
    },

    print0: async function (message, line = 0x80) {
        // line: 1行目は 0x80, 2行目は 0xC0
        await this.lcdByte(line, this.LCD_CMD);

        const str = message.padEnd(16, " "); // 16文字に揃える
        for (let i = 0; i < 16; i++) {
            await this.lcdByte(str.charCodeAt(i), this.LCD_CHR);
        }
    },

    clear: async function () {
        await this.lcdByte(0x01, this.LCD_CMD);
        await new Promise(resolve => setTimeout(resolve, 1));
    }
};

export default I2CLCD;
