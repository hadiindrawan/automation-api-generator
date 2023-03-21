
# Automation API Generator

This project has created to relieve work load as SDET or Automation Test Engineer. In moderation, automation API code able to write with only run the script and generate from Postman collection. You just export the collection, and run the Generator to write the automation code.

## Table of Contents
- [Objectives](#objectives)
- [Prerequisite](#prerequisite)
- [Installation](#installation)
  - [Important information](#important-information)
- [Lifecycle of Mocha Framework](#lifecycle-of-mocha-framework)
- [Folder Structure and Usage](#folder-structure-and-usage)
  - [/runner](#runner)
  - [/tests/data](#testsdata)
  - [/tests/helper](#testshelper)
  - [/tests/pages](#testspages)
  - [/tests/scenarios](#testsscenarios)
  - [/tests/schema](#testsschema)
- [Scenarios](#scenarios)
  - [Default templates](#default-templates)
  - [Default templates with body request](#default-templates-with-body-request)
- [Pages](#pages)
  - [Default templates](#default-templates-1)
  - [Default templates with JSON body](#default-templates-with-json-body)
  - [Default templates with attachment body](#default-templates-with-attachment-body)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Common Error](#common-error)

## Objectives

1. Generate Postman collection with JSON format into Mocha-Chai template scripts
2. Applying DDT (data-driven test) mechanism to request API with a lot of datas in body request
3. Applying POM (page-object model) mechanism to request the API so it can be reused to another test file
4. Have default verification for status code and json-schema
5. Create scripts that easy to maintain



## Prerequisite

Before run this generator mocha, you need to install:
- [NodeJS and NPM](https://nodejs.org/en/)

Check if node and npm are successfully installed:
```bash
node -v
npm -v
```

## Installation

1. Create your local project directory
2. [Export your Postman collection](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-collections) to JSON with Collection v2.1 format
3. Install package with npm
   
    ```bash
    npm install dot-generator-mocha
    ```
1. Generate template Mocha-Chai script with command
    ```bash
    npx dot-generator-mocha '<your-file-path>'
    ```
    The file path can be absolute or relative, depending on where the file is stored.
    For example, if your collection is stored in your local project directory:
    ```bash
    npx dot-generator-mocha 'My Project.postman_collection.json'
    ```
    or, if you use the absolute path:
    ```bash
    npx dot-generator-mocha 'C:\Users\Downloads\My Project.postman_collection.json'
    ```
1. Finish, the Mocha-CHai template scripts is successfully generated

    How to check if it's success:
    
    If you have a Postman collection named "My Project" with a request inside a folder named "User".
    - In the terminal, there is log with format:
        ```bash
        Generate Test tests/scenarios/<folder_name_of_Postman_collection>/<request_method>_<request_name>.spec.js
        ```
        For example:
        ```bash
        Generate Test tests/scenario/User/POST_login.spec.js
        ```
    - In the local directory:
        - There are `tests` folder
        - Inside `tests` folder, there are `pages`, `scenarios`, and `schema` folders
        - Inside each that folder, there are folders which name same as the folder inside the Postman Collection
        - Inside the folder there are files that has same name as the request Postman name
        
         For example, in the folder structure visualization:
        ```js hl_lines="1 2"
        ├───node_modules
        ├───runner
        ├───template
        └───tests
                ├───data
                ├───helper
                ├───pages
                │   └───User
                │       POST_login.js
                ├───scenarios
                │   └───User
                │       POST_login.spec.js
                └───schema
                        └───User
                        POST_login.json
        ```
        <!--Needs to be highlighted-->
        The folder / file name with blue font is the newly generated files.
2. Furhtermore, you can manage your test script files in your project directory
    
### Important information
    
- For repetitive usage, the package will generate files based on new requests in your Postman collection and existing files will not be replaced
- The package will read the existing test file name and do a comparison with the file to be generated. If the file to be generated does not exist, then the package will generate a new file.

## Lifecycle of Mocha Framework

After the template file is generated into your local directory, you can follow this lifecycle of Mocha framework:
1. Complete test files to meet your scenario needs --> folder: `/tests/scenario`
2. Configure request in `pages` file (if needed) --> folder: `/tests/pages`
3. Complete JSON-schema file to cover all your defined scenario --> folder: `/tests/schema`
4. Configure runner based on the defined test order --> folder: `runner`
5. Run your test

    You may use this command:
    ```bash
    npm run test
    ```
    Or you can configure new command in `package.json` file

## Folder Structure and Usage

### /runner
Folder to store runners for each group of test files. You may create a new file to categorize wach file tests based on the needs.

> It is generated automatically, grouped by your request folder in Postman collection. It will be stored by the order in which the requests are in your collection.

For example:

```javascript
//file /runner/user.js
require('../tests/scenarios/User/POST_register.spec')()
require('../tests/scenarios/User/POST_login.spec')()
module.exports = () => {}
```

The simple explanation:
- This file is generated from a collection with request folder called User and 2 requests inside, which are:
    1. Register
    2. Login
- This `user` runner will run your test file with `register` and `login` test name. The `register` test will be run first, then the `login` test.
- `module.exports = () => {}` code section is used to export this file so you can user it in your regression test file (if needed) or other runner files.

### /tests/data

Folder to store data required for the tests. By default, it will be empty, you can easily configure it based on your needs.

### /tests/helper

Folder to store required functions or methods for global use. Default will be filled with `requestHelper.js`. You may ignore this file and create a new file for your use.

### /tests/pages

Folder to store the detail request of each API. For detailed explanation, you can go to [Pages](pages.md) section.

### /tests/scenarios

Folder to store your test files. It is linked closely with pages file, especially with the same name files. For detailed explanation, you can go to [Scenarios](scenarios.md) section.

### /tests/schema

It stores the JSON of response body (if any) that will be converted automatically into JSON-schema in `pages` file.

> Data required is JSON response, not JSON-schema. You don't need to manually convert the JSON response to a JSON schema, because this template will do it!

How to use this folder:
1. Default file will be filled with key `success` and `failed`

    You may use this key or create your own object to store the JSON value
2. Prepare your JSON response that will be saved in a file along with its schema category
    
    For example:
    ```json
    //schema category -> success
    //it's json response
    {
        "token": "1234567890",
        "expires": "1970-01-01T00:00:00.00Z",
        "status": "Success",
        "result": "Success"
    }
    ```
    
3. Copy the predefined JSON response to value of key that match the category
    
    For example:
    ```json
    //file_name: login.json
    {
        "success":
        {
    		    "token": "1234567890",
    		    "expires": "1970-01-01T00:00:00.00Z",
    		    "status": "Success",
    		    "result": "Success"
    		},
        "failed":
        {
            "example": "" 
        }
    }
    ```

## Scenarios

Scenarios are files that configured to manage your test

### Default templates

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

    How it's done:
    - since the `pages` file consist a class, you can create a new object from the class to use the defined method
    - to build request specification and execute the request, you may use the `request()` method defined in [`pages`](pages.md) file
    
7. For response validation, the template create 2 default validations, which are:
    - status code
    - JSON schema for your body response
    
    Example:
    
    ```js
    expect(res.status).to.equal(200);
    expect(res.body).to.be.jsonSchema(new Request().expect('success'));
    ```
    
    The `new Request().expect('success')` section code will get the schema that has been defined in JSON schema file. If the value is `success`, the template will get the JSON schema value with key `success`.
    
### Default templates with body request

If your request has body, the template will give you a template of DDT usage in your test script.

The snippet of test file with DDT mechanism:

```js
let data = [
    { ddt: { example: "value_example", attachment: {"file": "tests/data/file/example.png"} }, response: { case: "Success cases", schema: "success", status: 200 } }
]

module.exports = () => {
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
    data.forEach((datas) => { <it()_code_section> })
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


## Pages

Pages is a folder to store files that configured to manage your request details.

### Default templates

```js
const chai = require('chai')
chai.use(require('chai-http'))
const json_responses = require('../../schema/User/GET_getuserbyuserid.json');
const requestHelper = require('../../helper/requestHelper');
require('dotenv').config()

class request {
    constructor() {
		this.api = chai.request(process.env.APP_URL)
		this.path = "/Account/v1/User/"
    }
    
    request(...args) {
		const response = this.api.get(this.path)
		.end(new requestHelper().getExpectFunc(args))
		
		return response
    }
  
    body(...args) {
		let obj = ''
		
		new requestHelper().objectMapping(obj, args)

		return obj
    }

    expect(cases="success") {
      	return new requestHelper().getSchema(json_responses, cases)
    }
}

module.exports = request
```

The template defines some general things, which are:

1. Import JSON schema file with same name file and saving it to `json_responses` variable. 

    ```js
    const json_responses = require('../../schema/User/GET_getuser.json');
    ```

    Furthermore, it will be used to get the defined response JSON body.
2. `class request{}`
    
    This is the main content of page file. It will consist some default methods that will be explained below. If you want to use these methods, you can create a new object in your [`scenarios`](scenarios.md) file.

    Code section:
    ```js
    class request{ <detail_of_api> }
    ```

    There are several detail of API that will be defined as methods, which are:
    - `constructor()`
    - `request()`
    - `body()`
    - `expect()`
3. Build `constructor(){}` section
   
   The `constructor()` method is a special method for creating and initializing objects created within a class.

   By default, the template will generate the endpoint of request. It will get your defined APP_URL from `.env` file and build the path URL.

   The code section:

    ```js
    constructor() {
      this.api = chai.request(process.env.APP_URL)
      this.path = "/Account/v1/User/"
      }
    ```

    This method contains a constant value of defined request, for example are `api` variable (to config the API host) and `path` variable (to config the path of API url).

    > You can cofigure your constant or static value in this method.
4.  Build `request(){}` section
  This section is automatically generated and used to build API requests that can be recognized by mocha-chai, you can see in this code section:

    ```js
    request(...args) {
      const response = this.api.get(this.path)
      .end(new requestHelper().getExpectFunc(args))
      
      return response
      }
    ```

    > It can vary according to the details of the request that is generated from your Postman collection.

    By default, here is how this template works:
    - method `request()` will receive arguments from tests file or somewhere in tests file that use this request file, this arguments stored in `args` variable
    - this method build request API with common chai syntax, which is:
      ```js
      const response = this.api.get(this.path) 
      ```
    - `.end(new requestHelper().getExpectFunc(args))`
      - this part is used to get the validation part of API
      - from tests file view, we can see it from this code section:
          ```js
          (err, res) => { <api_response_validation> }
          ```
5. Build `body(){}` section
   
   This code section is used to build your body data (if any). By default, if your request doesn't have body, the value of this method is:

   ```js
   body(...args) {
		let obj = ''
		
		new requestHelper().objectMapping(obj, args)

		return obj
    }
   ``` 
   For detailed explanation:
   - `obj` variable will store the raw JSON body that detected from your imported Postman request.
     - If your request has no body, it will store empty string as above
     - If the request has body, it will copy exactly same as body in Postman request. See more in this [Default templates with JSON body](#default-templates-with-json-body) subsection
   - `new requestHelper().objectMapping(obj, args)` section will do mapping the changes of your body
     - Instead of changing all the value in `obj` variable, `objectMapping()` method only changes the value of key you want to change. For example, see more in this [Default templates with JSON body](#default-templates-with-json-body) subsection
6. Build `expect(){}` section
    This code section is used to convert your JSON-body specified in schema file to JSON schema format. You may ignore this code section.

    Default value of this section:
    ```js
    expect(cases="success") {
      	return new requestHelper().getSchema(json_responses, cases)
    }
    ```

    For simple explanation:
    - `expect()` method will get argument from code section that called this method. The argument will be stored in `cases` variable.
    - this method will call `getShcema()` method in `requestHelper` class which will return the converted JSON body that matched with the `cases` value.
7. `module.exports = request`
  
    This section is used to export the request class so it can be used in your test file.

### Default templates with JSON body

Except the default value of template that defined above, this subsection will explain the example value of generated file if your request has JSON body.

```js
class request {
    constructor() {
      //constuctor method value
    }

    request(...args) {
		const response = this.api.post(this.path)
		.set("accept", "application/json")
		.set("Content-Type", "application/json")
		.send(this.body(new requestHelper().getParam(args)))
		.end(new requestHelper().getExpectFunc(args))
		
		return response
    }

    body(...args) {
		let obj = {
  "username": "example",
  "password": "example"
}

		new requestHelper().objectMapping(obj, args)
		return obj
    }

    expect(cases="success") {
      	return new requestHelper().getSchema(json_responses, cases)
    }
}

module.exports = request
```

  From example above, we can see several things:
  - The template will generate the default `request()` method in chai syntax

    ```js
    request(...args) {
		const response = this.api.post(this.path)
		.set("accept", "application/json")
		.set("Content-Type", "application/json")
		.send(this.body(new requestHelper().getParam(args)))
		.end(new requestHelper().getExpectFunc(args))
		
		return response
    } 
    ```

    This `request()` method build a request API with POST method to the `api` and `path` variable defined in `constructor()` method.
    
    Additionally, this method build a request with `.send()` chai syntax which will send the body defined in `body()` method below.

    The code section:
    ```js
    .send(this.body(new requestHelper().getParam(args)))
    ```

    `body()` method will get an argument with value returned from `getParam()` method in `requestHelper()` class. The `getParam()` method will send an `args` variable from `request()` method argument.

  - `body()` method

    This method will returned the defined request body. `obj` variable stores the default key-value of request body.

    For example:

    ```js
        let obj = {
      "username": "example",
      "password": "example"
    }
    ```

    From above, the request has body with `username` and `password` keys. The default value of each keys is `example`.

    > You can define the constant or static value of key body request in this part of code and make changes to test-related data in your tests file.

  - `new requestHelper().objectMapping(obj, args)` section
    
    This code will do mapping of your changes of body request. The changes value is indicated from `args` variable and the default value from `obj` variable. 

    This `args` value is passed from argument sent by `request()` method above.

### Default templates with attachment body

For this case, it has a default template as before, but the main difference is that it separates the request builder of text type and file type of form-data. You can see in this code section:

```javascript
class request {
	constructor() {
		//constructor method value
	}

	request(...args) {
		let datas = new requestHelper().getParam(args)
		let attaches = new requestHelper().getAttach(args)

		let response = this.api.post(this.path)
		.set("Content-Type", "multipart/form-data")

		Object.keys(this.body(datas)).forEach((key) => {
		response = response.field(key, JSON.stringify(this.body(datas)[key]))
		})

		Object.keys(this.attach(attaches)).forEach((at) => {
		if( typeof this.attach(attaches)[at] != 'object') {
			let att = new requestHelper().getFile(this.attach(attaches)[at])
			response = response.attach(at, att[0], att[1])
		} else {
			this.attach(attaches)[at].forEach((val) => {
			let att = new requestHelper().getFile(val)
			response = response.attach(at, att[0], att[1])
			})
		}
		})

		return response.end(new requestHelper().getExpectFunc(args))
	}

	body(...args) {
		let obj = {
			"username": "example",
			"password": "example"
		}

		new requestHelper().objectMapping(obj, args)
		return obj
	}

	attach(...args) {
		let objAtt = {
			"file": "<your_path_file>"
		}

		new requestHelper().objectMapping(objAtt, args)
		return objAtt
	}

	expect(cases="success") {
		return new requestHelper().getSchema(json_responses, cases)
	}
}

module.exports = request
```

For detailed explanation:
- `datas` variable - for text type data - you may ignore this section
  
  This variable is used to store the returned value from `getParam()` method in `requestHelper()` class. The `getParam()` method will separate `args` arguments specific to text type data.
  
  `datas` variable will then be used to build the body request (`this.body(datas)` code part) and then be mapped in code section below:
  
  ```js
  Object.keys(this.body(datas)).forEach((key) => {
		response = response.field(key, JSON.stringify(this.body(datas)[key]))
		})
  ```

  For each key-value in value returned from the `body()` method will be mapped to chai syntax `.field()` and later will be used to execute the request API.

- `attaches` variable - for file type data - you may ignore this section

  If `data` variable is storing the text type data, `attaches` variable stores the file type data. If you read the [scenarios](scenarios.md#default-templates-with-body-request) section, it will get the object data of `attachment` keys.

  Later, this variable will be used as an argument in `this.attach(attaches)` code section. For each key-value of file-type body request, it will be mapped to chai syntax `.attach()`.

  You can see that in this part code:

  ```js
  Object.keys(this.attach(attaches)).forEach((at) => {
		if( typeof this.attach(attaches)[at] != 'object') {
			let att = new requestHelper().getFile(this.attach(attaches)[at])
			response = response.attach(at, att[0], att[1])
		} else {
			this.attach(attaches)[at].forEach((val) => {
			let att = new requestHelper().getFile(val)
			response = response.attach(at, att[0], att[1])
			})
		}
		}) 
  ```
  
- `body()` method
  
  This method is used to build the key-value of body request that has text type data in form-data.

  You can see the example below:

  ```js
  body(...args) {
		let obj = {
			"username": "example",
			"password": "example"
		}

		new requestHelper().objectMapping(obj, args)
		return obj
	}
  ```

  It has same specification as body in JSON body which are:
  - you can define the static value of body request.
  - you can only change the specific key-value of body that you want to change based on the test case.
  
- `attach()` method
  
  It has the similar specification with `body()` method, as you can see:

  ```js
  attach(...args) {
		let objAtt = {
			"file": "<your_path_file>"
		}

		new requestHelper().objectMapping(objAtt, args)
		return objAtt
	}
  ```

  For detailed explanation:
  - This method has `objAtt` variable that will stores the key-value of body request that has file type.
    
    You can define the static of default value of request key in this variable. Also, you can use the relative or absolute path for the value, but it is recommended to use a relative path based on your project root.
  - `objectMapping()` method of `requestHelper()` class will map the key-value defined in `objAtt` variable to the `args` variable of the arguments in `attach()` method.

## Implementation

## Best Practices

## Common Error

[def]: #automation-api-generator