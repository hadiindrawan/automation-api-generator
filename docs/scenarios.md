# Scenarios

Scenarios are files that configured to manage your test

## Default templates

```javascript
const expect = require('chai').expect
const chai = require('chai')
chai.use(require('chai-json-schema'))
const Request = require('../../pages/User/GET_getuser');


module.exports = () => {
    describe("Test Get User", () =>  {
        
        it('Success', (done) => {
            new Request().request( 
                (err, res) => {
                    expect(res.status).to.equals(200);
                    expect(res.body).to.be.jsonSchema(new Request().expect('success'))
                    done();
            })
        });
        
    })
}
```


1. Import the package used, which is `chai`
2. Import the same name page file with variable name `Request`

    The code section referred:
    
    ```javascript
    const Request = require('../../pages/User/GET_getuser');
    ```
    
    This `Request` variable can be used to configure your request API in test needs.
    
3. Exporting the module, so it can be used in your test runner

    The code section referred:
    
    ```javascript
    module.exports = () => { <your_test_section> }
    ```
4. There is one test suite and named with format `Test <request_name_in_Postman_collection>`
    
    For example:
    
    ```javascript
    describe("Test Get User", () => { <your_test_case_code_section> }) 
    ```
    
    P.S: you can add your suite test (or `describe` part) based on your needs, also you can change the suite name.
5. There is one test case that defined as `Success`
    
    Example:
    ```javascript
    it('Success', (done) => { <your_request_and_validation> })
    ```

6. Build and make a request to the defined API (it has been defined in pages file)

    Example:
    
    ```javascript
    new Request().request( (err, res) => { <your_response_validation> } )
    ```

    
    
7. For response validation, the template create 2 default validations, which are:
    - status code
    - JSON schema for your body response
    
    Example:
    
    ```js
    expect(res.status).to.equal(200);
    expect(res.body).to.be.jsonSchema(new Request().expect('success'));
    ```
    
    The `new Request().expect('success')` section code will get the schema that has been defined in JSON schema file. If the value is `success`, the template will get the JSON schema value with key `success`.
    
## Default templates with body request

If your request has body, the template will give you a template of DDT usage in your test script.

The snippet of test file with DDT mechanism:

```js
// If you need data driven, just write driven keys (no need all keys), for example
let data = [
    // Example data driven, some default keys need exist: ddt, response, attachment (if any)
    { ddt: { example: "value_example", attachment: {"file": "tests/data/file/example.png"} }, response: { case: "Success cases", schema: "success", status: 200 } }
]

module.exports = () => {
    // Write your test here
    describe("Test Login", () =>  {
        
        data.forEach((datas) => {
            it(datas.response.case, (done) => {
                new Request().request(datas.ddt, 
                    (err, res) => {
                        expect(res.status).to.equals(datas.response.status);
                        expect(res.body).to.be.jsonSchema(new Request().expect(datas.response.schema))
                        done();
                })
            });
        })
        
    })
}
```

The difference with requests that do not have a body are, except the default template:
1. `data` variable
    
    For simple explanation:
    - this variable is used to stored the combination of data used for tests scenarios
    - inside data array, there are many of object type data
    - inside each object, there are several key defined:
    
    | Key  | Required | Definition |
    | ------------- | ------------- | ---- |
    | <i>ddt</i>  | `true`  | object to store the combination of one data test |
    | <i>example</i>  | `false`  | `example` key and `value_key` value is the example of key-value usage if you want to change the value of specified key from body request. <br><br>if you do not specify this key-value, the request will be executed with the default request defined in [`pages`]() file. |
    | <i>attachment</i>  | `false`  | `attachment` is a key that stored object with key-value of body request that needs to attach some files and needs to change the default of request defined in `pages` file |
    | <i>file</i>  | `true` if you use `attachment` key  | `file` is example of key from body request that stores the file attachment and you want to configure the value of file <br> <br> you may configure the key based on your request API and the value based on the path where your file is stored (relative to your local project directory path) |
    | <i>response</i>  | `true`  | `response` is a key that stored object with key-value of general configurations of each data test, which are the test case name and the expected validation<br> <br> you can configure the key-value inside object based on your needs, whether you need the default key (`case`, `schema`, `status`) or maybe you need other key-value, e.g `message` |
    
2. Looping for each object `data`

    After the data test is prepared in `data` variable, the script will do looping for each object inisde `data` array
    
    The code section:
    
    ```js
    data.forEach((datas) => { <it()_code_section> }
    ```

    Each object from `data` variable will be stored in `datas` variable and will then be mapped based on needs.
3. Mapping for each key from object `datas`

    Each object in `datas` variable is then mapped, like the code below, the default are:
    
    ```js
    it(datas.response.case, (done) => {
        new Request().request(datas.ddt, 
            (err, res) => {
                expect(res.status).to.equals(datas.response.status);
                expect(res.body).to.be.jsonSchema(new Request().expect(datas.response.schema))
                done();
        })
    });
    ```
    
    - `datas.response.case`: the stored test case name will be used as test case name in `it()` function
    - `datas.ddt`: the stored `ddt` object will be used to detect the key-value of body request you want to change
    - `datas.response.status`: the stored status code expected will be used to validate the status code of each response API
    - `datas.response.schema`: validation of each JSON schema response will be referenced from this key
    
    Except for the `datas.response.case` and `datas.ddt` mapping, you can configure the mapping freely based on the `data` variable you set up
    
P.S: You can see the detailed implementation in [Implementation]() page