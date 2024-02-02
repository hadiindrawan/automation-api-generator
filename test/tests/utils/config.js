const dotenv = require("dotenv");

export class Config {
  constructor() {
    // Write your constructor here, if you need
  }

  env() {
    // change according to your need
    dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });
    // Defining an object named 'env', contained your variables needed
    return {
      host: process.env.MAIN
    };
  }
}
