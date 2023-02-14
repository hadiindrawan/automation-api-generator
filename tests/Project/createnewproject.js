const expect = require('chai').expect
const chai = require('chai')
chai.use(require('chai-http'))
chai.use(require('chai-json-schema'))
require('dotenv').config()
const api = chai.request(process.env.APP_URL);

const bodyRequest = require('../../body/Project/createnewproject');
let body = new bodyRequest()

let data = [
    { name: "Testing Todoist",testinimah: "valuetest", cases: "success", responseStatus: "" }
]

module.exports = function (){
    describe("Test Create New Project", function () {
        
        data.forEach(({ name, testinimah, cases, responseStatus}) => {
            it(cases, function (done) {
                api.post("rest/v1/projects")
                
                .send(new bodyRequest(name, testinimah).request())
                .end(function (err, res) {
                    expect(res.status).to.equals(responseStatus);
                    done();
                });
            });
        })
    })
}