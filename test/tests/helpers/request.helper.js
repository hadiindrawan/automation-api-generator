const fs = require("fs");
const toJsonSchema = require("to-json-schema");

class requestHelper {
  constructor() {
    // Write your constructor here, if you need
    this.waitFor = (ms) => new Promise((r) => setTimeout(r, ms));
  }

  // This method used for get parameter which send from test file
  async getPayload(arg) {
    let data = {};
    arg.forEach((datas) => {
      if (typeof datas == "object") {
        data = Object.assign({}, datas);
      }
    });
    return data;
  }

  // If your test using attachment, this method used for get parameter of attachment file like path and keys
  async getAttachment(arg) {
    let data = {};
    arg.forEach((datas) => {
      if (typeof datas == "object") {
        if (datas.hasOwnProperty("attachment")) {
          data = Object.assign({}, datas.attachment);
        }
      }
    });
    return data;
  }

  getDefaultData(data_array) {
    return data_array.find((item) => item.case.default);
  }

  // If your test using attachment, this method used for get binary file from your computer
  async getFile(data) {
    const path = data.split("/");
    const name = path[path.length - 1];
    const file = await fs.readFile(data);

    return {
      file,
      name
    };
  }

  // This method used for convert json file to json schema
  getSchema(json_responses, cases) {
    const options = {
      objects: {
        postProcessFnc: (schema, obj, defaultFnc) => ({
          ...defaultFnc(schema, obj),
          required: Object.getOwnPropertyNames(obj)
        })
      }
    };

    if (json_responses.hasOwnProperty(cases)) {
      return toJsonSchema(json_responses[cases], options);
    } else {
      throw new Error("JSON Schema: " + cases + ", does not exist!");
    }
  }

  // This method user for mapping keys object which you want to be change/replace the object
  async mapObject(obj, arg) {
    let newObj = {};
    let map = arg[0];

    if (typeof obj === "object") {
      newObj = { ...obj };
    }

    Object.keys(map).forEach((key) => {
      if (newObj[key] !== undefined) {
        newObj[key] = map[key];
      }

      Object.entries(newObj).forEach(([nestedKey, nestedVal]) => {
        if (Array.isArray(nestedVal)) {
          nestedVal.forEach((innerObj) => {
            if (innerObj[key] !== undefined) {
              innerObj[key] = map[key];
            }

            Object.values(innerObj).forEach((dObjArr) => {
              if (Array.isArray(dObjArr)) {
                dObjArr.forEach((dObj) => {
                  if (dObj[key] !== undefined) {
                    dObj[key] = map[key];
                  }
                });
              }
            });
          });
        } else if (typeof nestedVal === "object") {
          Object.values(nestedVal).forEach((dObjArr) => {
            if (Array.isArray(dObjArr)) {
              dObjArr.forEach((dObj) => {
                if (dObj[key] !== undefined) {
                  dObj[key] = map[key];
                }
              });
            }
          });
        }
      });
    });

    return newObj;
  }
}

module.exports = requestHelper;
