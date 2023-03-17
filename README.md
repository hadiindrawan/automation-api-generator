
# Automation API Generator

This project has created to relieve work load as SDET or Automation Test Engineer. In moderation, automation API code able to write with only run the script and generate from Postman collection. You just export the collection, and run the Generator to write the automation code.




## Features

- Mocha chai generator


## Installation

First export your Postman collection which want to generate

Clone the project repository to your directory and move json file (Postman collection export) to your directory  

Install package with npm

```bash
  npm install
```

Run the generator with
```bash
   npm run generate <your-json-file>
```

Example:
```bash
   npm run generate MyProject.json
```
And, that's it, you just convert your Postman collection json file to Automation code (Mocha chai)
## Configure your test

To run tests, you should configure some file

- If your scenario have some cases, you can using DDT (Data Driven Test), you can configure on test file in data variable
- If you using json schema to validate the response, you just input each json response to json_response folder file
- For run the test, you should configure the runner file
