
# Automation API Generator

This project has created to relieve work load as SDET or Automation Test Engineer. In moderation, automation API code able to write with only run the script and generate from Postman collection. You just export the collection, and run the Generator to write the automation code.

## Objectives

1. Generate Postman collection with JSON format into Mocha-Chai template scripts
2. Applying DDT (data-driven test) mechanism to request API with a lot of datas in body request
3. Applying POM (page-object model) mechanism to request the API so it can be reused to another test file
4. Have default verification for status code and json-schema
5. Create scripts that easy to maintain

## Table of Contents
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
    - [If You Need Other Arguments](#if-you-need-other-arguments)
  - [Implementation](#implementation)
  - [Best Practices](#best-practices)
  - [Common Error](#common-error)

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
    npm i --save-dev '@dot.indonesia/po-gen'
    ```
4. Create `package.json` file

    ```bash
    npm init
    ```

    Your terminal will display the option configuration for your `package.json` file. You may configure the input or follow the default with command:
    
    ```bash
    npm init -y
    ```

1. Generate template Mocha-Chai script with command
    ```bash
    npx '@dot.indonesia/po-gen'
    ```
    
    Your terminal will display the option configuration for your template, for detail:

    | Question | Option / Answer  |
    |-----|-----|
    | What framework will be used? | `Mocha chai`  |
    | What type of modules does your project use? | `Javascript modules (import/export)` <br> `CommonJS (require/exports)`  |
    | Do you want to install ESlint? | `Yes` <br> `No`  |
    | Do you want to install Mochawesome? | `Yes` <br> `No` |  
    | Type your json file to be generate (example.json): | your json file path |  

    P.S:
    - You can change the option with arrow key, based on your needs.
    - To copy your file path in the last question, you can do:
      - right-click on your file
      - choose `Copy as path`
      - in your last question in terminal, `CTRL + SHIFT + V` to paste the value and `ENTER`
    - The file path can be absolute or relative, depending on where the file is stored.
    
1. Finish, the Mocha-CHai template scripts is successfully generated

    How to check if it's success:
    
    If you have a Postman collection named "My Project" with a request inside a folder named "User".
    - In the terminal, there is log with format:
        ```bash
        Generate Test tests/scenarios/<folder_name_of_Postman_collection>/<request_method>_<request_name>.spec.js completed successfully
        ```
        For example:
        ```bash
        Generate Test tests/scenario/User/POST_login.spec.js completed successfully
        ```
    - In the local directory:
        - There are `tests` folder
        - Inside `tests` folder, there are `data`, `helper`, `pages`, `scenarios`, `schema`, and `utils` folders
        - Inside `pages`, `scenarios`, and `schema` folder, there are folders which name same as the folder inside the Postman Collection
        - Inside the folder there are files that has same name as the request Postman name
        
         For example, in the folder structure visualization:
        ```js hl_lines="1 2"
        ├───node_modules
        ├───runner
        └───tests
                ├───data
                ├───helper
                ├───pages
                │   └───User
                │       POST_login.js
                ├───scenarios
                │   └───User
                │       POST_login.spec.js
                ├───schema
                |       └───User
                |       POST_login.json
                └───utils
        ```
    
## Template Generation
    
If you have installed the package and just wants to generate your JSON file, you can use this command:

  ```bash
    npx '@dot.indonesia/po-gen' generate
  ```

  You can repeat the step for the last question in [installation](#installation) section.
 
 For repetitive usage, the package will generate files based on new requests in your Postman collection. The existing files will not be replaced, instead the terminal will show a log like this:

  ```bash
  The request of <request_name> has already created
  ```

## Environment Generation

This section will generate the exported environment collection in Postman to `.env` files (it is optional). Furthermore, it will store the value of several data used in automation based on the environment.

Steps you can follow after you install package and init project:

1. [Export the environment collection](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-collections) in Postman
2. Input command in terminal:

    ```bash
    npx '@dot.indonesia/po-gen' env-generate
    ```
    Your terminal will display the option configuration for your template, for detail:

    | Question | Answer  |
    |-----|-----|
    | Input your json file to be generate (example.json) | your environment json path <br> P.S: it can be a relative or absolute path and you can use the same steps as [installation](#installation) process |
    | Input your environment name | your environment name, e.g dev, staging, prod |

3. Finish, `.env` file is successfully generated
   
   How to check if its successful:
    - In terminal, there is log like this:
      ```bash
      Generate environment file completed successfully
      ```
    - In your local directory, there is file `.env.<your_inputted_environment_name>`, for example: `.env.dev`
    - Inside the file, there are key-values that are generated based on the exported JSON collection, for example:

      ```.env
      baseUrl=baseUrl_value
      username=username_value
      password=password_value
      ```

Furthermore, you can generate the environment based on your defined development environment. For usage in your automation script, you can see the [utils](#utils) section below.

## Lifecycle of Mocha Framework

After the template file is generated into your local directory, you can follow this lifecycle of Mocha framework:
1. Complete test files to meet your scenario needs --> folder: `/tests/scenario`
2. Configure request in `pages` file (if needed) --> folder: `/tests/pages`
3. Complete JSON-schema file to cover all your defined scenario --> folder: `/tests/schema`
4. Configure runner based on the defined test order --> folder: `runner`
5. Run your test

    You may use this command:
    ```bash
    npm run test:dev
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

Folder to store data required for the tests. By default, there is an empty `file` folder. You can easily configure it based on your needs.

### /tests/helper

Folder to store required functions or methods for global use. Default will be filled with `request.helper.js` file (you may ignore this file) and `general.helper.js` file (you can create your method needed here).

### /tests/pages

Folder to store the detail request of each API. For detailed explanation, you can go to [Pages](#pages) section.

### /tests/scenarios

Folder to store your test files. It is linked closely with pages file, especially with the same name files. For detailed explanation, you can go to [Scenarios](#scenarios) section.

### /tests/schema

It stores the JSON of response body (if any) that will be converted automatically into JSON-schema in `pages` file.

> Data required is JSON response, not JSON-schema. You don't need to manually convert the JSON response to a JSON schema, because this template will do it!

How to use this folder:
1. Default file will be filled with key `success` and `failed`

    You may use this key or create your own object to store the JSON value
2. Prepare your JSON response that will be saved in a file along with its schema category
    
    For example:
    ```js
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
    ```js
    //file_name: login.json
    class schema {
      json() {
          const json = 
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
          return json
      }
    }
    module.exports = schema
    ```

### /tests/utils

This folder stores `config.js` file that will do configuration for your `.env` file. You can see the detail explanation [here](#utils).

## Scenarios

Scenarios are files that configured to manage your test

### Default templates

```javascript
const expect = require('chai').expect
const chai = require('chai')
chai.use(require('chai-json-schema'))
const pages = require('../../pages/User/GET_getuser.pages.js');
const config = require('../../utils/config')

module.exports = () => {
    describe("Test Get User", () =>  {
        
        it('Success', (done) => {
            new pages().request( 
                (err, res) => {
                    expect(res.status).to.equals(200);
                    expect(res.body).to.be.jsonSchema(new pages().expect('success'))
                    done();
            })
        });
    })
}
```

1. Import the package used, which is `chai`
2. Import the same name page file with variable name `pages`

    The code section referred:
    
    ```javascript
    const pages = require('../../pages/User/GET_getuser.pages.js');
    ```
    
    This `pages` variable will be used to configure your request API in test needs.
    
3. Import `config.js file`, in case you need to use value from `.env` file

    The code section referred:
    
    ```js
    const config = require('../../utils/config')
    ```

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
    new pages().request( (err, res) => { <your_response_validation> } )
    ```

    How it's done:
    - since the `pages` file consist a class, you can create a new object from the class to use the defined method. Specific code: `new pages()`
    - to build request specification and execute the request, you may use the `request()` method defined in [`pages`](#pages) file
    
7. For response validation, the template create 2 default validations, which are:
    - status code
    - JSON schema for your body response
    
    Example:
    
    ```js
    expect(res.status).to.equal(200);
    expect(res.body).to.be.jsonSchema(new pages().expect('success'));
    ```
    
    The `new pages().expect('success')` section code will get the schema that has been defined in JSON schema file. If the value is `success`, the template will get the JSON schema value with key `success`.
    
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
                new pages().request(datas.ddt, 
                    (err, res) => {
                        expect(res.status).to.equals(datas.response.status);
                        expect(res.body).to.be.jsonSchema(new pages().expect(datas.response.schema))
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
    - this variable is used to store the combination of data used for tests scenarios
    - inside `data` array, there are many of object type data
    - inside each object, there are several key defined:
    
    | Key  | Required | Definition |
    | ------------- | ------------- | ---- |
    | <i>ddt</i>  | `true`  | object to store the combination of one data test |
    | <i>example</i>  | `false`  | `example` key and `value_key` value is the example of key-value usage if you want to change the value of specified key from body request. <br><br>if you do not specify this key-value, the request will be executed with the default request defined in [`pages`](#pages) file. |
    | <i>attachment</i>  | `false`  | `attachment` is a key that stored object with key-value of body request that needs to attach some files and needs to change the default of request defined in [`pages`](#pages) file |
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
        new pages().request(datas.ddt, 
            (err, res) => {
                expect(res.status).to.equals(datas.response.status);
                expect(res.body).to.be.jsonSchema(new pages().expect(datas.response.schema))
                done();
        })
    });
    ```
    
    - `datas.response.case`: the stored test case name will be used as test case name in `it()` function
    - `datas.ddt`: the stored `ddt` object will be used to detect the key-value of body request you want to change
    - `datas.response.status`: the stored status code expected will be used to validate the status code of each response API
    - `datas.response.schema`: validation of each JSON schema response will be referenced from this key
    
    Except for the `datas.response.case` and `datas.ddt` mapping, you can configure the mapping freely based on the `data` variable you set up
    
P.S: You can see the detailed implementation in [Implementation](#implementation) page


## Pages

Pages is a folder to store files that configured to manage your request details.

### Default templates

```js
const chai = require('chai')
chai.use(require('chai-http'))
const schema = require('../../schema/User/GET_getuser.schema.js');
const requestHelper = require('../../helper/request.helper.js');
const config = require('../../utils/config.js')

class pages {
    constructor() {
		this.api = chai.request(new config().env().host)
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
      	return new requestHelper().getSchema(new schema().json(), cases)
    }
}

module.exports = pages
```

The template defines some general things, which are:

1. Import JSON schema file with same name file and saving it to `schema` variable. 

    ```js
    const schema = require('../../schema/User/GET_getuser.schema.js');
    ```

    Furthermore, it will be used to get the defined response JSON body.
2. `class pages{}`
    
    This is the main content of page file. It will consist some default methods that will be explained below. If you want to use these methods, you can create a new object in your [`scenarios`](#scenarios) file.

    Code section:
    ```js
    class pages{ <detail_of_api> }
    ```

    There are several detail of API that will be defined as methods, which are:
    - `constructor()`
    - `request()`
    - `body()`
    - `expect()`
3. Build `constructor(){}` section
   
   The `constructor()` method is a special method for creating and initializing objects created within a class.

   By default, the template will generate the endpoint of request. It will get your defined host from `.env` file and build the path URL.

   The code section:

    ```js
    constructor() {
      this.api = chai.request(new config().env().host)
      this.path = "/Account/v1/User/"
      }
    ```

    This method contains a constant value of defined request, for example are `api` variable (to config the API host) and `path` variable (to config the path of API url).

    > You can cofigure your constant or static value in this method.
4.  Build `request(){}` section
  This section is automatically generated and used to build API requests that can be recognized by chai, you can see in this code section:

    ```js
    request(...args) {
      const response = this.api.get(this.path)
      .end(new requestHelper().getExpectFunc(args))
      
      return response
      }
    ```

    > It can vary according to the details of the request that is generated from your Postman collection.

    By default, here is how this template works:
    - method `request()` will receive arguments from tests file that use this request file, the arguments stored in `args` variable
    - this method build request API with common chai syntax, which is:
      ```js
      const response = this.api.get(this.path) 
      ```
    - `.end(new requestHelper().getExpectFunc(args))`
      - this part is used to get the validation part of API which is recognized by an argument of type function.
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
      	return new requestHelper().getSchema(new schema().json(), cases)
    }
    ```

    For simple explanation:
    - `expect()` method will get argument from code section that called this method. The argument will be stored in `cases` variable.
    - this method will call `getShcema()` method in `requestHelper` class which will return the converted JSON body from `json()` method in exported `schema()` class that matched with the `cases` value.
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

    > You can define the constant or static value of key body request in this part of code and make changes to test-related data in your scenarios file.

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

  If `data` variable is storing the text type data, `attaches` variable stores the file type data. If you read the [scenarios](#default-templates-with-body-request) section, it will get the object data of `attachment` keys.

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

### If You Need Other Arguments

In case you need to pass data (except the `datas.ddt` and `(err, ress)` function) from scenario file to page file, you can use the [concept of rest argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) in method/function, which are location sensitive based on the value passed from method usage and method definition.

For example, you need to pass below data from scenario file to your request builder in page file:
- token
- id
- query
- path URL
- etc, something similar

you can use this configuration steps:
1. Define the value of argument in `request()` method in scenario file.
   
    For example the token and id value:
    ```js
    new Request().request(token_value, id_value, 
      (err, res) => {});
    ```

1. Map the argument passed in `request()` method from scenario file to your request builder in page file.
   
   For above case, you want to map token and id value in your request API. The `request()` method in page file will look like this:

    ```js
    constructor() {
		this.api = chai.request(new config().env().host);
		this.path = "/Account/v1/User/";
    }
    
    request(...args) {
		const response = this.api.get(this.path + args[1])
		.set("Authorization", "Bearer " + args[0])
		.end(new requestHelper().getExpectFunc(args))
		
		return response
    }
    ```

    The simple explanation:
    - arguments in first index (`args[0]`) is used to store the token value in scenario file, so you map it to the token value in your API request.
      
      Code section:
      ```js
      "Bearer " + args[0] 
      ```
    - arguments in second index (`args[1]`) is used to store the id value for URL path in scenario file, so you map it to the id value in your API request.
      
      Code section:
      ```js
      this.path + args[1]
      ```

> You can configure the scenario-related data needs in your scenario files and configure the data mapping in your page file.

## Utils

This folder, especially `config.js` files, is used to configure the environment-based data value that will be used in automation script.

> This pattern was created to meet the need to run scripts in different environments, where each environment has different test data

How it works:
1. The `config.js` file will recognize the environment value that being executed in terminal when running the tests.

    You can see or configure it in `package.json` file specific in `scripts` key. By default, one of the values is:

    ```json
    "test:dev": "cross-env NODE_ENV=dev mocha runner/regression.js --timeout 15000"
    ```

    From above, we know that the `NODE_ENV` value is `dev`. Furthermore, this value will be used to recognize the `.env` file that has been created. In this case, it will get the value from `.env.dev` file.

2. `env()` method stores the value from defined `.env` file into key that will be used in your automation script.

    For example:

    ```js
    env() {
        dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });

        const env = {
            host: process.env.MAIN
        }
    
        return env
    }
    ```

    By default, it gives example for `MAIN` key in `.env` file. Value of `MAIN` will be saved in `host` key. Later, it will be used in `pages` file like this:

    ```js
    this.api = chai.request(new config().env().host)
    ```

So, if you want to configure and use your `.env` data, you can follow this step:

1. Create key-value in your `.env` file
    For example:
    
    ```.env
    USERNAME=username_value
    ```
2. Create new key in `env` variable inside `env()` method with value being the key of value defined in `.env` file.

    For example:

    ```js
    const env = {
      host: process.env.MAIN,
      username: process.env.USERNAME //this is the new key-value
    }
    ```
3. Use the key in `env` variable in your script file

    For example:

    ```js
    const config = require('../../utils/config.js')

    const username = new config().env().username;
    ```

    How to use the env variable:
    - create new `config()` class
    - use the `env()` method
    - get the key defined (`.username`)

## Implementation

You can see the implementation [here](https://github.com/aisyahns/automation-api-implementation).

[def]: #automation-api-generator