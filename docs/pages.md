# Pages

Pages is a folder to store files that configured to manage your request details.

## Default templates

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

## Default templates with JSON body

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

## Default templates with attachment body

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
- `data` variable
  
  This variable is used to store separate `args` arguments specific to text type data. It will then be mapped in `body()` method below.
- `attaches` variable

  If `data` variable is storing the text type data, `attaches` variable stores the file type data. If you read the [scenarios](scenarios.md#default-templates-with-body-request) section, it will get the object data of `attachment` keys.

- Request builder for text type form-data
  
- Request builder for file type form-data