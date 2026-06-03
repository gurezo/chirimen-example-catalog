// PCA9685拡張ドライバを使って、0番ポートに繋いだサーボと、1番ポートに繋いだLEDを制御
// 警告：サーボを1番ポートに接続すると故障します。要注意

import { requestI2CAccess } from "./node_modules/node-web-i2c/index.js";
import PCA9685 from "./pca9685.js"; // setPWM拡張版 pca9685(サーボ用)ドライバ: PWMの周波数は61Hz固定の制限付き
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

main();

var pca9685;

async function main() {
    const i2cAccess = await requestI2CAccess();
    const port = i2cAccess.ports.get(1);
    pca9685 = new PCA9685(port, 0x40);
    // servo setting for sg90
    // Servo PWM pulse: min=0.0011[sec], max=0.0019[sec] angle=+-60[deg]
    await pca9685.init(0.001, 0.002, 30);
    startServo(); // awaitを付けずに起動することで、startServoとstartLEDを同時に実行
    startLED();
}

async function startServo() {
    for (; ;) {
        await pca9685.setServo(0, -30);
        console.log("-30 deg");
        await sleep(1000);
        await pca9685.setServo(0, 30);
        console.log("30 deg");
        await sleep(1000);
    }
}

async function startLED() {
    var dutyRatio = 0, incl = 0.1;
    for (; ;) {
        await pca9685.setPWM(1, dutyRatio); // 1番ポートをPWM制御
        await sleep(100);
        dutyRatio += incl;
        if (dutyRatio >= 1) {
            incl = -0.1;
            dutyRatio=1;
        } else if (dutyRatio <= 0) {
            incl = 0.1
            dutyRatio=0;
        }
    }
}
