const chai = require("chai");
chai.use(require("chai-http"));
const requestHelper = require("@helper/request.helper.js");
const { Config } = require("@util/config.js");
const data = require("@data/Auth/auth.data.js");
const { schema } = require("@schema/Auth/POST_login.schema.js");
const { Logger } = require("@util/logger.js");
const logger = new Logger();

class Request {
  constructor() {
    // Write your constructor here, if you nee
    // Set up the api with the endpoint based on the environment and change this according to endpoint service
    this.host = new Config().env().host;
    this.url = "/users/login"; // Set up the API path to the route endpoint
  }

  get request() {
    return chai.request(this.host);
  }

  // This method handles making the HTTP request based on given arguments.
  async api(...args) {
    // Send HTTP POST request to the specified path and send the required body with params extracted from args.
    try {
      const response = await this.request
        .post(this.url)
        .send(
          await this.getMappedBody(await new requestHelper().getPayload(args))
        );

      await this.createLogging(response);
      return response;
    } catch (err) {
      await this.createLogging(0, err);
    }
  }

  // This method used for provide body or payload of the request and return object
  async getMappedBody(...args) {
    const defaultData = new requestHelper().getDefaultData(data.login_data);
    const dataMapped = await new requestHelper().mapObject(
      defaultData.driven,
      args
    );

    return dataMapped;
  }

  async createLogging(response, error) {
    const isError = error !== undefined;
    const logLevel = isError ? "error" : "debug";
    const statusMessage = isError ? "Failed" : "Successful";
    const endpoint = `${this.host}${this.url}`;
    const requestPayload = isError ? error.response.request : response.request;
    const responsePayload = isError ? error.response.body : response.body;

    logger
      .console({ level: logLevel })
      .http(`${statusMessage} to hit login endpoint ${endpoint}`);

    logger.file({ type: "request", level: logLevel }).http({
      endpoint: endpoint,
      data: requestPayload
    });

    logger.file({ type: "response", level: logLevel }).http({
      endpoint: endpoint,
      data: responsePayload
    });
  }

  // This method used for provide expectation and return json schema
  expectedSchema(cases = "success") {
    return new requestHelper().getSchema(schema, cases);
  }
}

module.exports = Request;
