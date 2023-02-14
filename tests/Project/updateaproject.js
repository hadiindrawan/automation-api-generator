const expect = require('chai').expect
const chai = require('chai')
chai.use(require('chai-http'))
chai.use(require('chai-json-schema'))
require('dotenv').config()
const api = chai.request(process.env.APP_URL);

const bodyRequest = require('../../body/Project/updateaproject');
let body = new bodyRequest()

let data = [
    { name: "coba test", cases: " ", responseStatus: "" }
]

module.exports = function (){
    describe("Test Update a project", function () {
        
        data.forEach(({ name, cases, responseStatus}) => {
            it(cases, function (done) {
                api.post("rest/v1/projects/233421")
                .set("X-Request-Id", "2293776387").set("Content-Type", "application/json").set("Accept", "application/json")
                .send(new bodyRequest(name).request())
                .end(function (err, res) {
                    expect(res.status).to.equals(responseStatus);
                    done();
                });
            });
        })
    })
}