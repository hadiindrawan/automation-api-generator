const expect = require("chai").expect;
const chai = require("chai");
chai.use(require("chai-json-schema"));
const data = require("@data/Auth/auth.data.js");
const Request = require("@page/Auth/POST_login.pages.js");
const config = require("@util/config.js");

describe("Test Login", () => {
  data.login_data.forEach(async (data) => {
    it(data.case.name, async () => {
      const response = await new Request().api(data.driven);

      expect(response.status).to.equals(data.case.status);
      expect(response.body).to.be.jsonSchema(
        new Request().expect(data.case.schema)
      );
    });
  });
});
