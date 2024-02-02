const winston = require("winston");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const { CustomFileTransport } = require("./custom_file_transport");
const colorizer = format.colorize();

const logFormat = combine(
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  printf((output) =>
    colorizer.colorize(
      output.level,
      `[${output.timestamp}] ${output.level.toUpperCase()}: ${output.message}`
    )
  )
);

export class Logger {
  constructor() {
    // Write your constructor here, if you need
  }

  console = ({ service = "example", level = "debug" }) =>
    createLogger({
      level,
      defaultMeta: { service },
      format: logFormat,
      transports: [
        // Output logs to console in simple message format
        new transports.Console()
      ]
    });

  file = ({ service = "example", type = "response", level = "debug" }) =>
    createLogger({
      level,
      defaultMeta: { service },
      format: logFormat,
      transports: [
        // Output logs to console in simple message format
        new CustomFileTransport({
          format: winston.format.json(),
          filename: `./logs/${type}.json`
        })
      ]
    });
}
