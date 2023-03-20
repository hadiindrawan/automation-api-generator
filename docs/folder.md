# Folder Structure and Usage

## /runner
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

## /tests/data

Folder to store data required for the tests. By default, it will be empty, you can easily configure it based on your needs.

## /tests/helper

Folder to store required functions or methods for global use. Default will be filled with `requestHelper.js`. You may ignore this file and create a new file for your use.

## /tests/pages

Folder to store the detail request of each API. For detailed explanation, you can go to [Pages](pages.md) section.

## /tests/scenarios

Folder to store your test files. It is linked closely with pages file, especially with the same name files. For detailed explanation, you can go to [Scenarios](scenarios.md) section.

## /tests/schema

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