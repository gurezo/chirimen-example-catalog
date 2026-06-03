// Remote Example GPIO Ping Pong
// 2台のPiZeroをつなぎ、片方のSW(センサ)を押すともう一方のLED(アクチュエータ)が点灯するサンプル
// for CHIRIMEN with nodejs

import {requestGPIOAccess} from "./node_modules/node-web-gpio/dist/index.js";
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
import nodeWebSocketLib from "websocket"; // https://www.npmjs.com/package/websocket
import {RelayServer} from "./RelayServer.js";

var channel;
var gpioPortLED,gpioPortSW;

async function connect(){
	// GPIOポートLEDの初期化
	var gpioAccess = await requestGPIOAccess();
	var mbGpioPorts = gpioAccess.ports;
	gpioPortLED = mbGpioPorts.get(26);
	await gpioPortLED.export("out"); //portLED out
	gpioPortSW = mbGpioPorts.get(5);
	await gpioPortSW.export("in"); //portSW in
	
	// webSocketリレーの初期化
	var relay = RelayServer("chirimentest", "chirimenSocket" , nodeWebSocketLib, "https://chirimen.org");
	channel = await relay.subscribe("chirimenPingPong");
	console.log("web socketリレーサービスに接続しました");
	channel.onmessage = controlLED; // Note: RelayServerの仕様として、自分で送ったメッセージは返却されない

	sensLoop();
}

async function sensLoop(){
    while(true){
        const v = await gpioPortSW.read();
	channel.send(v);
        await sleep(300);
    }
}

function controlLED(messge){
	if ( messge.data =="0"){
		gpioPortLED.write(1);
		console.log("LED ON");
	} else if ( messge.data =="1"){
		gpioPortLED.write(0);
		console.log("LED OFF");
	}
}

connect();
