// @ts-check
// MCP3424 12~18bit ADC driver for CHIRIMEN raspberry pi3
// Temperature and Humidity I2C Sensor
// based on 
//  https://github.com/kleebaum/bayeosraspberrypi/blob/master/bayeosraspberrypi/mcp3424.py
//  https://github.com/jbeale1/DataAcq/blob/master/MCP3424_read.py
// Programmed by Satoru Takagi

/** @param {number} ms Delay for a number of milliseconds. */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

var MCP3424 = function(i2cPort,slaveAddress){
	if (!slaveAddress){
		slaveAddress = 0x68;
	}
	this.i2cPort = i2cPort;
	this.i2cSlave = null;
	this.slaveAddress = slaveAddress;
}

MCP3424.prototype = {
	init: async function(){
		this.i2cSlave = await this.i2cPort.open(this.slaveAddress);
	},
	readData: async function(){
		await this.i2cSlave.writeByte(0x8c); // 18bit ch1 gain1
		var mdata = await this.i2cSlave.readBytes(3); // prev data..
		var rawData = ((mdata[0] & 0b00000011 )<<16) + (mdata[1] << 8) + mdata[2]; // celsius
        console.log(mdata[0], mdata[1],mdata[2],rawData);        
		return {
			rawData: rawData,
		}

	}
};

export default MCP3424;
