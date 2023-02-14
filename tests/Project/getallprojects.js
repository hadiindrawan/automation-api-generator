const expect = require('chai').expect
const chai = require('chai')
chai.use(require('chai-http'))
chai.use(require('chai-json-schema'))
require('dotenv').config()
const api = chai.request(process.env.APP_URL);

module.exports = function (){
    describe("Test Get All Projects", function () {
        
        it(cases, function (done) {
            api.get("rest/v1/projects")
            
            .end(function (err, res) {
                expect(res.status).to.equals(responseStatus);
                done();
            });
        });
    })
}