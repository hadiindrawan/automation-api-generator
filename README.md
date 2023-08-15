
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
  - [Template Generation](#template-generation)
  - [Environment Generation](#environment-generation)
  - [Lifecycle of Mocha Framework](#lifecycle-of-mocha-framework)
  - [Folder Structure and Usage](#folder-structure-and-usage)
    - [/tests/data](#testsdata)
    - [/tests/helpers](#testshelpers)
    - [/tests/pages](#testspages)
    - [/tests/scenarios](#testsscenarios)
    - [/tests/schemas](#testsschemas)
    - [/tests/utils](#testsutils)
  - [Scenarios](#scenarios)
    - [Default templates](#default-templates)
    - [Default templates with body request](#default-templates-with-body-request)
  - [Pages](#pages)
    - [Default templates](#default-templates-1)
    - [Default templates with attachment body](#default-templates-with-attachment-body)
    - [If You Need Other Arguments](#if-you-need-other-arguments)
  - [Utils](#utils)
  - [Configuration File](#configuration-file)
  - [How to run the tests](#how-to-run-the-tests)
  - [Implementation](#implementation)

## Prerequisite

Before run this generator mocha, you need to install:
- [NodeJS and NPM](https://nodejs.org/en/)

Check if node and npm are successfully installed:
```bash
node -v
npm -v
```

## Installation

> For using this package name in your bash / terminal, you need to give ' (apostrophe) before and after the package name like below example. Otherwise, you will get an error.

1. Create your local project directory
2. [Export your Postman collection](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-collections) to JSON with Collection v2.1 format
4. Create `package.json` file

    ```bash
    npm init
    ```

    Your terminal will display the option configuration for your `package.json` file. You may configure the input or follow the default with command:
    
    ```bash
    npm init -y
    ```

3. Install package with npm
   
    ```bash
    npm i --save-dev '@dot.indonesia/po-gen'
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
    | Select one or more case or suite: | select your case or suite to be generate |

    P.S:
    - You can change the option with arrow key, based on your needs.
    - To copy your file path in the last question, you can do:
      - right-click on your file
      - choose `Copy as path`
      - in your last question in terminal, `CTRL + SHIFT + V` to paste the value and `ENTER`
    - The file path can be absolute or relative, depending on where the file is stored.
    
1. Finish, the Mocha-Chai template scripts is successfully generated

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
        └───tests
                ├───data
                │   └───User
                │       User.data.js
                ├───helpers
                ├───pages
                │   └───User
                │       POST_login.pages.js
                ├───scenarios
                │   └───User
                │       POST_login.spec.js
                ├───schemas
                |   └───User
                |       POST_login.schema.js
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
4. Configure mocha configuration file if you want to customize files to be run
5. Run your test

    You may use this command:
    ```bash
    npm run regression:dev
    ```
    Or you can configure new command in `package.json` file

## Folder Structure and Usage

### /tests/data

Folder to store data required for the tests. There will be generating from your collection request body. And it will be use in the tests which has the body in their requests. The data file is suite file which the data body including in file. The data is using driven data, so there is a default structure which unable to change.

For example:
  ```js
  export const login_data = [
    {
      case: {
        name: "Successful login with valid credentials",
        schema: "success",
        status: 200,
        default: true
      },
      driven: { 
        email: "pogen@mail.com", 
        password: "password" 
      },
      attachment: {}
    }
  ];
  ```
`case` property contained test case name (name), key of schema (schema), status code expectation (status) and (default) is flag for data which generated from collection.
`driven` property contained body or payload of the request. `attachment` property contained files or attachments if any.

And you can organize another cases like negative cases with the same structure data, and just put in that array.

| Key  | Required | Definition |
| ------------- | ------------- | ---- |
| <i>case</i>  | `true`  | `response` is a key that stored object with key-value of general configurations of each data test, which are the test case name and the expected validation<br> <br> you can configure the key-value inside object based on your needs, whether you need the default key (`name`, `schema`, `status`) or maybe you need other key-value, e.g `message`. For `default` is flag for data which generated from collection|
| <i>driven</i>  | `true`  | object to store the combination of one data test |
| <i>attachment</i>  | `false`  | `attachment` is a key that stored object with key-value of body request that needs to attach some files and needs to change the default of request defined in [`pages`](#pages) file |

### /tests/helpers

Folder to store required functions or methods for global use. Default will be filled with `request.helper.js` file (you may ignore this file).

### /tests/pages

Folder to store the detail request of each API. For detailed explanation, you can go to [Pages](#pages) section.

### /tests/scenarios

Folder to store your test files. It is linked closely with pages file, especially with the same name files. For detailed explanation, you can go to [Scenarios](#scenarios) section.

### /tests/schemas

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
        "user": {
          "_id": "64c0dcaac88e770013420d7c",
          "firstName": "po",
          "lastName": "gen",
          "email": "pogen@mail.com",
          "__v": 1
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGMwZGNhYWM4OGU3NzAwMTM0MjBkN2MiLCJpYXQiOjE2OTA2MDE5Mzl9.tC91agJhr-0C0ocWvn5axNl2AeHtEFkzyTPsOV0SZgE"
      }
    ```
    
3. Copy the predefined JSON response to value of key that match the category
    
    For example:
    ```js
    //file_name: POST_login.schema.js
    export const schema = {
      success: {
        "user": {
          "_id": "64c0dcaac88e770013420d7c",
          "firstName": "po",
          "lastName": "gen",
          "email": "pogen@mail.com",
          "__v": 1
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGMwZGNhYWM4OGU3NzAwMTM0MjBkN2MiLCJpYXQiOjE2OTA2MDE5Mzl9.tC91agJhr-0C0ocWvn5axNl2AeHtEFkzyTPsOV0SZgE"
      },
      failed: {}
    };
    ```

### /tests/utils

This folder stores `config.js` file that will do configuration for your `.env` file. You can see the detail explanation [here](#utils).

## Scenarios

Scenarios are files that configured to manage your test

### Default templates

```javascript
const expect = require("chai").expect;
const chai = require("chai");
chai.use(require("chai-json-schema"));
const Request = require("@page/User/GET_getlistuser.pages.js");
const config = require("@util/config.js");

describe("Test Get List User", () => {
  it("Successful case", async () => {
    const response = await new Request().api();

    expect(response.status).to.equals(200);
    expect(response.body).to.be.jsonSchema(new Request().expect("success"));
  });
});

```

1. Import the package used, which is `chai`
2. Import the same name page file with variable name `pages`

    The code section referred:
    
    ```javascript
    const pages = require('@pages/User/GET_getlistuser.pages.js');
    ```
    
    This `pages` variable will be used to configure your request API in test needs.
    
3. Import `config.js file`, in case you need to use value from `.env` file

    The code section referred:
    
    ```js
    const config = require('@utils/config')
    ```
4. There is one test suite and named with format `Test <request_name_in_Postman_collection>`
    
    For example:
    
    ```javascript
    describe("Test Get List User", () => { <your_test_case_code_section> }) 
    ```
    
    P.S: you can add your suite test (or `describe` part) based on your needs, also you can change the suite name.
5. There is one test case that defined as `Success`
    
    Example:
    ```javascript
    it('Successful case', async () => { <your_request_and_validation> })
    ```

6. Build and make a request to the defined API (it has been defined in pages file)

    Example:
    
    ```javascript
    const response = await new Request().api();
    ```

    How it's done:
    - since the `pages` file consist a class, you can create a new object from the class to use the defined method. Specific code: `new Request()`
    - to build request specification and execute the request, you may use the `api()` method defined in [`pages`](#pages) file
    - the response after hit the endpoint will save in `response` variable.
7. For response validation, the template create 2 default validations, which are:
    - status code
    - JSON schema for your body response
    
    Example:
    
    ```js
    expect(response.status).to.equals(200);
    expect(response.body).to.be.jsonSchema(new Request().expect("success"));
    ```
    
    The `new Request().expect('success')` section code will get the schema that has been defined in JSON schema file. If the value is `success`, the template will get the JSON schema value with key `success`.
    
### Default templates with body request

If your request has body, the template will give you a template of DDT usage in your test script.

```js
const expect = require("chai").expect;
const chai = require("chai");
chai.use(require("chai-json-schema"));
const data = require("@data/Auth/auth.data.js");
const Request = require("@page/Auth/POST_login.pages.js");

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

```
`data` variable contained data which inmported from data file in folder data.
The difference with requests that do not have a body are, except the default template:
1. `data` variable
    
    For simple explanation:
    - this variable is used to store the combination of data used for tests scenarios
    - `data` is global import which all variable in file imported too.
    - To use the data, you can call the variable with `case.variable_data_name`
    - inside variable contained array which needed for your test
    
2. Looping for each object `data.variable_data_name`

    After the data test is prepared in `data.variable_data_name` variable, the script will do looping for each object inside `data` array
    
    The example code section:
    
    ```js
    data.login_data.forEach((data) => { <it()_code_section> })
    ```

    Each object from `data.login_data` variable will be stored in `data` variable and will then be mapped based on needs.
3. Mapping for each key from object `data`

    Each object in `data` variable is then mapped, like the code below, the default are:
    
    ```js
    it(data.case.name, async () => {
      const response = await new Request().api(data.driven);

      expect(response.status).to.equals(data.case.status);
      expect(response.body).to.be.jsonSchema(
        new Request().expect(data.case.schema)
      );
    });
    ```
    
    - `data.response.case`: the stored test case name will be used as test case name in `it()` function
    - `data.ddt`: the stored `ddt` object will be used to detect the key-value of body request you want to change
    - `data.response.status`: the stored status code expected will be used to validate the status code of each response API
    - `data.response.schema`: validation of each JSON schema response will be referenced from this key
    
    Except for the `data.response.case` and `data.ddt` mapping, you can configure the mapping freely based on the `data.login_data` variable you set up
    
P.S: You can see the detailed implementation in [Implementation](#implementation) page


## Pages

Pages is a folder to store files that configured to manage your request details.

### Default templates

```js
const chai = require("chai");
chai.use(require("chai-http"));
const request_helper = require("@helper/request.helper.js");
const config = require("@util/config.js");
const data = require("@data/Auth/auth.data.js");
const { schema } = require("@schema/Auth/POST_login.schema.js");

class Request {
  constructor() {
    // Write your constructor here, if you nee
    // Set up the api with the endpoint based on the environment and change this according to endpoint service
    this.url = "/users/login"; // Set up the API path to the route endpoint
  }

  get request() {
    return chai.request(new config().env().host);
  }

  // This method handles making the HTTP request based on given arguments.
  async api(...args) {
    // Send HTTP POST request to the specified path and send the required body with params extracted from args.
    const response = await this.request
      .post(this.url)
      .set("Content-Type", "application/json")
      .send(
        await this.getMappedBody(await new request_helper().getPayload(args))
      );

    return response;
  }

  // This method used for provide body or payload of the request and return object
  async getMappedBody(...args) {
    const defaultData = new request_helper().getDefaultData(
      data.login_data
    );
    const dataMapped = await new request_helper().mapObject(
      defaultData.driven,
      args
    );

    return dataMapped;
  }

  // This method used for provide expectation and return json schema
  expect(cases = "success") {
    return new request_helper().getSchema(schema, cases);
  }
}

module.exports = Request;
```

The template defines some general things, which are:

1. Import JSON schema file with same name file and saving it to `schema` variable. 

    ```js
    const schema = require('@schema/User/GET_getuser.schema.js');
    ```

    Furthermore, it will be used to get the defined response JSON body.
2. `class Request{}`
    
    This is the main content of page file. It will consist some default methods that will be explained below. If you want to use these methods, you can create a new object in your [`scenarios`](#scenarios) file.

    Code section:
    ```js
    class Request{ <detail_of_api> }
    ```

    There are several detail of API that will be defined as methods, which are:
    - `constructor()`
    - `request()`
    - `api()`
    - `getMappedBody()`
    - `expect()`
3. Build `constructor(){}` section
   
   The `constructor()` method is a special method for creating and initializing objects created within a class.

   By default, build the path URL.

   The code section:

    ```js
    constructor() {
      this.path = "/users/login"
      }
    ```

    This method contains a constant value of defined request, for example is `path` variable (to config the path of API url).
    > You can cofigure your constant or static value in this method.
4. Get `request()` method

    By default, the template will generate the endpoint of request. It will get your defined host from `.env` file
    ```js
      get request() {
        return chai.request(new config().env().host);
      }
    ```
5.  Build `api(){}` section
  This section is automatically generated and used to build API requests that can be recognized by chai, you can see in this code section:

    ```js
    async api(...args) {
      const response = await this.request
        .post(this.url)
        .send(
          await this.getMappedBody(await new request_helper().getPayload(args))
        );

      return response;
    }
    ```

    > It can vary according to the details of the request that is generated from your Postman collection.

    By default, here is how this template works:
    - method `api()` will receive arguments from tests file that use this request file, the arguments stored in `args` variable
    - this method build request API with common chai syntax, which is:
      ```js
      const response = await this.request.post(this.url) 
      ```
    - Payload
        ```js
          .send(
            await this.getMappedBody(await new request_helper().getPayload(args))
          );
        ```
      To send the payload, but the first get the mapped body if any changes using `this.getMappedBody()` which is send the body argument.
    - Return reponse request which the format is JSON using `return response;`
6. Build `getMappedBody(){}` section
   
   This code section is used to build your body data (if any). By default, if your request doesn't have body, the value of this method is:

   ```js
    async getMappedBody(...args) {
      const defaultData = new request_helper().getDefaultData(
        data.login_data
      );
      const dataMapped = await new request_helper().mapObject(
        defaultData.driven,
        args
      );

      return dataMapped;
    }
   ``` 
   For detailed explanation:
   - `defaultData` variable will store the raw JSON body that detected from your imported Postman request.
     - If the request has body, it will copy exactly same as body in Postman request. See more in this [Default templates with JSON body](#default-templates-with-json-body) subsection
   - `await new request_helper().mapObject(defaultData.driven, args` section will do mapping the changes of your body
     - Instead of changing all the value in `defaultData` variable, `mapObject()` method only changes the value of key you want to change. For example, see more in this [Default templates with JSON body](#default-templates-with-json-body) subsection
    - The mapped data saved in `dataMapped` and return it

  > If the request did not have body or payload, then getMappedBody() method will not generate
7. Build `expect(){}` section
    This code section is used to convert your JSON-body specified in schema file to JSON schema format. You may ignore this code section.

    Default value of this section:
    ```js
    expect(cases = "success") {
      return new request_helper().getSchema(schema, cases);
    }
    ```

    For simple explanation:
    - `expect()` method will get argument from code section that called this method. The argument will be stored in `cases` variable.
    - this method will call `getSchema()` method in `request_helper` class which will return the converted JSON body from `json()` method in exported `schema()` class that matched with the `cases` value.
8. `module.exports = Request`
  
    This section is used to export the request class so it can be used in your test file.

### Default templates with attachment body

For this case, it has a default template as before, but the main difference is that it separates the request builder of text type and file type of form-data. You can see in this code section:

```javascript
const chai = require("chai");
chai.use(require("chai-http"));
const request_helper = require("@helper/request.helper.js");
const config = require("@util/config.js");
const data = require("@data/Invitation Salman/invitationsalman.data.js");
const {
  schema
} = require("@schema/Invitation Salman/POST_uploadcsv.schema.js");

class Request {
  constructor() {
    // Write your constructor here, if you nee
    // Set up the api with the endpoint based on the environment and change this according to endpoint service
    this.url = "/upload/file/csv"; // Set up the API path to the route endpoint
  }

  get request() {
    return chai.request(new config().env().host);
  }

  // This method handles making the HTTP request based on given arguments.
  async api(...args) {
    const payload = new request_helper().getPayload(args)
    const attachment = new request_helper().getAttachment(args)

    // Send HTTP POST request to the specified path and send the required body with params extracted from args.
    const response = await this.request
      .post(this.url)
      .set("Content-Type", "multipart/form-data")
      .set("Platform", "BACKOFFICE")
      .set("Authorization", "Bearer {{access_token}}");

    Object.keys(await this.getMappedBody(payload)).forEach(async (key) => {
      response = await response.field(key, JSON.stringify(await this.getMappedBody(payload)[key]));
    });

    Object.keys(await this.getMappedAttachment(attachment)).forEach(
      async (key) => {
        if (
          typeof (await this.getMappedAttachment(attachment)[key]) != "object"
        ) {
          const raw = await new request_helper().getFile(
            await this.getMappedAttachment(attachment)[key]
          );
          response = await response.attach(key, raw.file, raw.name);
        } else {
          await this.getMappedAttachment(attachment)[key].forEach(
            async (val) => {
              const raw = await new request_helper().getFile(val);
              response = await response.attach(key, raw.file, raw.name);
            }
          );
        }
      }
    );

    return response;
  }

  // This method used for provide body or payload of the request and return object
  async getMappedBody(...args) {
    const defaultData = await new request_helper().getDefaultData(
      data.uploadcsv_data
    );
    const dataMapped = await new request_helper().mapObject(
      defaultData.driven,
      args
    );

    return dataMapped;
  }

  // This method used for provide attachment file and return object
  async getMappedAttachment(...args) {
    const defaultData = await new request_helper().getDefaultData(
      data.uploadcsv_data
    );
    const dataMapped = await new request_helper().mapObject(
      defaultData.driven.attachment,
      args
    );

    return dataMapped;
  }

  // This method used for provide expectation and return json schema
  expect(cases = "success") {
    return new request_helper().getSchema(schema, cases);
  }
}

module.exports = Request;

```

For detailed explanation:
- `data` variable - for text type data - you may ignore this section
  
  This variable is used to store the returned value from `getPayload()` method in `request_helper()` class. The `getPayload()` method will separate `args` arguments specific to text type data.
  
  `data` variable will then be used to build the body request (`this.getMappedBody(data)` code part) and then be mapped in code section below:
  
  ```js
  Object.keys(await this.getMappedBody(payload)).forEach(async (key) => {
    response = await response.field(key, JSON.stringify(await this.getMappedBody(payload)[key]));
  });
  ```

  For each key-value in value returned from the `getMappedBody()` method will be mapped to chai syntax `.field()` and later will be used to execute the request API.

- `attachment` variable - for file type data - you may ignore this section

  If `data` variable is storing the text type data, `attachment` variable stores the file type data. If you read the [scenarios](#default-templates-with-body-request) section, it will get the object data of `attachment` keys.

  Later, this variable will be used as an argument in `this.getMappedAttachment(attachment)` code section. For each key-value of file-type body request, it will be mapped to chai syntax `.attach()`.

  You can see that in this part code:

  ```js
  Object.keys(await this.getMappedAttachment(attachment)).forEach(
    async (key) => {
      if (
        typeof (await this.getMappedAttachment(attachment)[key]) != "object"
      ) {
        const raw = await new request_helper().getFile(
          await this.getMappedAttachment(attachment)[key]
        );
        response = await response.attach(key, raw.file, raw.name);
      } else {
        await this.getMappedAttachment(attachment)[key].forEach(
          async (val) => {
            const raw = await new request_helper().getFile(val);
            response = await response.attach(key, raw.file, raw.name);
          }
        );
      }
    }
  );
  ```

- `getMappedAttachment()` method
  
  It has the similar specification with `body()` method, as you can see:

  ```js
  async getMappedAttachment(...args) {
    const defaultData = await new request_helper().getDefaultData(
      data.uploadcsv_data
    );
    const dataMapped = await new request_helper().mapObject(
      defaultData.driven.attachment,
      args
    );

    return dataMapped;
  }
  ```

  For detailed explanation:
  - This method has `defaultData` variable that will stores the key-value of body request that has file type. It is assigned from default data.
    
    You can define the static of default value of request key in this variable. Also, you can use the relative or absolute path for the value, but it is recommended to use a relative path based on your project root.
  - `mapObject()` method of `request_helper()` class will map the key-value defined in `defaultData` variable to the `args` variable of the arguments in `getMappedAttachment()` method.

### If You Need Other Arguments

In case you need to pass data (except the `data.driven`) from scenario file to page file, you can use the [concept of rest argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) in method/function, which are location sensitive based on the value passed from method usage and method definition.

For example, you need to pass below data from scenario file to your request builder in page file:
- token
- id
- query
- path URL
- etc, something similar

you can use this configuration steps:
1. Define the value of argument in `api()` method in scenario file.
   
    For example the token and id value:
    ```js
    await new Request().api(token, id, data.driven);
    ```

1. Map the argument passed in `api()` method from scenario file to your request builder in page file.
   
   For above case, you want to map token and id value in your request API. The `api()` method in page file will look like this:

    ```js
    api(...args) {
      const response = await this.request
        .post(this.url + args[1])
        .set("Authorization", "Bearer " + args[0])
    
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
    "regression:dev": "cross-env NODE_ENV=dev mocha --specs Regression --timeout 15000"
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

## Configuration File
    
Configuration file is the important file to run the test. This is using the default Mocha config `.mocharc.js` which is include some options. Here is default file after generating the test.

```js
const runTestsList = {
  Auth: [
    "tests/scenarios/Auth/POST_login.spec.js",
    "tests/scenarios/Auth/POST_logout.spec.js"
  ],
  Base: ["tests/scenarios/GET_profile.spec.js"],
  Regression: "tests/scenarios/**/*.spec.js"
};

const ignoreTestsList = [
  // write your ignore tests here
];

function getSpecsList() {
  const runOptArgument = process.argv.indexOf("--specs");
  const runOpt = runOptArgument !== -1 ? process.argv[runOptArgument + 1] : "Regression";

  if (runOpt.includes("/") || runOpt in runTestsList) {
    return runTestsList[runOpt];
  }

  if (runOpt.includes(",")) {
    return runOpt.split(",").flatMap((key) => runTestsList[key]);
  }
}

module.exports = {
  require: ["@babel/register"],
  jobs: 1,
  package: "./package.json",
  reporter: "spec",
  ignore: ignoreTestsList,
  spec: getSpecsList(),
  "trace-warnings": true,
  ui: "bdd"
};

```
The config export some option for test. 
- `require` import some dependencies needed
- `jobs` the test run in one task on one time. If you want to run some test on one time, just add how much you want
- `package` call the package.json
- `reporter` report style for showing the result of tests
- `ignore` list of ignore or skip test file. The list of tests path collected in variable `ignoreTestsList` which is array formatted
- `spec` list of test file will be execute. There is funtion to filter input runner, and return array from `runTestsList` variabel. <br>
  In `runTestsList` variabel there is some default keys. The keys has generated from suite in your JSON collection, for example `Auth` which include some path file. And the other key is `Base` which has generated if the test file does'nt have suite. And `Regression` key, it is key for run all test file in scenario folder
- `trace-warnings` debug mode
- `ui` style of the test using bdd.

## How to run the tests

Actually to run test is so easy. There is using script from `package.json` which is linked with config file. 

```json
"scripts": {
  "regression:dev": "cross-env NODE_ENV=dev mocha --specs Regression --timeout 15000"
}
```
As default, the `regression:dev` will generate. Look at the scripts syntax, you can see `--specs` argument. It is use to identify the key of the `runTestsList` in config file. This is some way to run the test:
- Run `only one test` file: 

  ```json
  "scripts": {
    "login:dev": "cross-env NODE_ENV=dev mocha --specs tests/scenarios/Auth/POST_login.spec.js --timeout 15000"
  }
  ```

  You just copy the path of your test file and put in `--specs` argument in scripts

- Run `a suite`: 
  ```json
  "scripts": {
    "asuite:dev": "cross-env NODE_ENV=dev mocha --specs Auth --timeout 15000"
  }
  ``` 
  You just call the suite name in `--specs` argument
  
- Run `some suite`:

  ```json
  "scripts": {
    "somesuite:dev": "cross-env NODE_ENV=dev mocha --specs Auth,Base --timeout 15000"
  }
  ``` 

  You can call the suites name in `--specs` argument, and you should serapate them with comma (`,`)

## Implementation

You can see the implementation [here](https://github.com/aisyahns/automation-api-implementation).

[def]: #automation-api-generator