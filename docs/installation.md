# Installation

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
    
## Important information:
    
- For repetitive usage, the package will generate files based on new requests in your Postman collection and existing files will not be replaced
- The package will read the existing test file name and do a comparison with the file to be generated. If the file to be generated does not exist, then the package will generate a new file.