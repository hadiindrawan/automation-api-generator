const expect = require("chai").expect;
const chai = require("chai");
chai.use(require("chai-json-schema"));
const Request = require("@page/Auth/POST_logout.pages.js");
const config = require("@util/config.js");

describe("Test Logout", () => {
  it("Successful case", async () => {
    const response = await new Request().api();

    expect(response.status).to.equals(200);
    expect(response.body).to.be.jsonSchema(new Request().expect("success"));
  });
});
