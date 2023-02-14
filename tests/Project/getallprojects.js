const expect = require('chai').expect
const chai = require('chai')
chai.use(require('chai-http'))
chai.use(require('chai-json-schema'))
require('dotenv').config()
const api = chai.request(process.env.APP_URL);

const bodyRequest = require('../../body/Project/getallprojects');
let body = new bodyRequest()

let data = [
    {{dataDriven}}
]

module.exports = function (){
    describe("Test Get All Projects", function () {
        
        data.forEach(({ {{keyDataDriven1}}, cases, responseStatus}) => {
            it(cases, function (done) {
                api.get("rest/v1/projects")
                
                .send(new bodyRequest({{keyDataDriven2}}).request())
                .end(function (err, res) {
                    expect(res.status).to.equals(responseStatus);
                    done();
                });
            });
        })
    })
}