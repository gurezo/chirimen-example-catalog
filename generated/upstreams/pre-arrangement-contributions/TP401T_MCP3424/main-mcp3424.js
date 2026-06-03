import {requestI2CAccess} from "./node_modules/node-web-i2c/index.js";
import MCP3424 from "./mcp3424.js";
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const mcp3424 = new MCP3424(port, 0x68);
  await mcp3424.init();

  while (true) {
    const { rawData } = await mcp3424.readData();
    console.log(
      [
        `rawdata: ${rawData}`,
      ].join(", ")
    );

    await sleep(500);
  }
}
