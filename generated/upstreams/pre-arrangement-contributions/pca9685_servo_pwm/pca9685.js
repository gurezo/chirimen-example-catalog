// PCA9685 servo motors driver with raw PWM output extension
// WARNING: If setPWM is used for terminals to which servo motors are connected, there is a risk of servo motor failure.
// NOTE: setPWM has a limitation fixed at 61 Hz.

var PCA9685 = function(i2cPort,slaveAddress){
  this.i2cPort = i2cPort;
  this.i2cSlave = null;
  this.slaveAddress = slaveAddress;
  this.minPulse=null;
  this.maxPulse=null;
  this.angleRange=null;
};

PCA9685.prototype = {
  sleep: function(ms){
    return new Promise((resolve)=>{setTimeout(resolve,ms);});
  },
  init: function(minPulse,maxPulse,angleRange,noSetZero){
    // minPulse,maxPulse: in sec
    // angleRange : -angleRange to +angleRange degrees
    if(this.minPulse && this.maxPulse && this.angleRange){
      console.error("alredy set param");
    }
    if(minPulse && maxPulse && angleRange){
      this.minPulse = minPulse;
      this.maxPulse = maxPulse;
      this.angleRange = angleRange;
    } else {
      this.minPulse = 0.0011;
      this.maxPulse = 0.0019;
      this.angleRange = 30.0;
    }

    return new Promise((resolve, reject)=>{
      this.i2cPort.open(this.slaveAddress).then(async (i2cSlave)=>{
        this.i2cSlave = i2cSlave;
        await this.i2cSlave.write8(0x00,0x00);
        await this.i2cSlave.write8(0x01,0x04);
        await this.i2cSlave.write8(0x00,0x10);
        await this.i2cSlave.write8(0xfe,0x64);
        // await this.i2cSlave.write8(0x00,0x00);
        await this.i2cSlave.write8(0x00,0b00100000); // 2020/12/06 改良：mode0レジスタでオートインクリメントモードをONにし、レジスタ書き込みタイムラグを最小にすることでビクつきを解消する
        // await this.i2cSlave.write8(0x06,0x00); // このコードは蛇足かな
        // await this.i2cSlave.write8(0x07,0x00);
        await this.sleep(300);
        if ( !noSetZero ){
          for ( var servoPort = 0 ; servoPort < 16 ; servoPort ++ ){
            this.setServo(servoPort, 0).then(() => resolve(), () => reject());
          }
        }
      },(err)=>{
        reject(err);
      });
    });
  },
  setServo: async function (servoPort, angle) {
    if (this.i2cSlave == null) {
      throw new Error("i2cSlave is not open yet.");
    }

    const portStart = 8;
    const portInterval = 4;
    const freq = 61; // Hz
    const tickSec = ( 1 / freq ) / 4096; // 1bit resolution( sec )

    var minPulse,maxPulse,angleRange,pulseRange;
    if(this.minPulse && this.maxPulse && this.angleRange){
      minPulse = this.minPulse;
      maxPulse = this.maxPulse;
      pulseRange = maxPulse - minPulse;
      angleRange = this.angleRange;
    }else{
      throw new Error("wrong param.");
    }
    if (angle < -angleRange) {
        angle = -angleRange;
    } else if (angle > angleRange) {
        angle = angleRange;
    }
    if ( servoPort < 0){
        servoPort = 0;
    } else if ( servoPort > 15 ){
        servoPort = 15;
    }

    var pulse = ((minPulse + maxPulse) + angle / angleRange * pulseRange ) / 2.0;
    var ticks = Math.round(pulse / tickSec);

    var tickH = (( ticks >> 8 ) & 0x0f);
    var tickL = (ticks & 0xff);

    var pwm = Math.round(portStart + servoPort * portInterval);
    // await this.i2cSlave.write8(pwm + 1, tickH); // これら二つのレジスタ書き込みのタイムラグがビクつきの原因
    // await this.i2cSlave.write8(pwm, tickL);
    await this.i2cSlave.writeBytes([pwm , tickL , tickH]); // 2020/12/06 オートインクリメントを利用し一気に書き込む
  },

  setPWM: async function(pwmPort, dutyRatio) {
    // dutyRatio : 0.0(OFF) .. 1.0(ON)
    // Note: 周波数は全チャンネル共通のためサーボに合わせて61Hzに固定される制限あり
    const portStart = 8;
    const portInterval = 4;
    if (this.i2cSlave == null) {
      throw new Error("i2cSlave Address does'nt yet open!");
    }
    if (pwmPort < 0 || pwmPort > 15) {
      throw new Error("PWM Port should be between 0 to 15");
    }
    if (dutyRatio < 0 || dutyRatio > 1) {
      throw new Error("dutyRatio should be between 0.0 to 1.0");
    }
    var ticks = Math.floor(4095 * dutyRatio);
    var tickH = (ticks >> 8) & 0x0f;
    var tickL = ticks & 0xff;

    var pwm = Math.round(portStart + pwmPort * portInterval);
    await this.i2cSlave.writeBytes([pwm , tickL , tickH]);
  }
};

export default PCA9685;
