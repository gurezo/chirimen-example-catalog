# ADRSZOD ゼロワン 臭気センサ拡張基板 をとりあえず動かしてみる
* https://bit-trade-one.co.jp/adrszod/
* TP-401T(アナログ出力センサ)がI2C ADCのMCP3424 ch1 に接続されている基板
* MCP3424のI2Cアドレスは0x68
* 回路図: https://github.com/bit-trade-one/RasPi-Zero-One-Series/blob/master/5th/ADRSZOD_Odd_Sensor/Schematics/rpizero_airsens_v1_schematics.pdf
  
まだ中途半端ですが、I2C ADCのドライバはmcp3424.js、アプリはmain-mcp3424.js 同じディレクトリに設置。node main-mcp3424.js で起動します。

* ガスがないとき：50000台
* ガスがあるとき：70000台以上になるようです
