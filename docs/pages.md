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
