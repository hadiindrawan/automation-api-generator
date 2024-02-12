const fs = require("fs");
const winston = require("winston");

const logDir = "./logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export class CustomFileTransport extends winston.transports.File {
  constructor(options) {
    // Pass the options to the parent class constructor
    super({ ...options, dirname: logDir });
  }
}
