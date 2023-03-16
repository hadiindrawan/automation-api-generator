const fs = require('fs')
const toJsonSchema = require('to-json-schema');


class requestHelper {
    constructor() {
        // Write your constructor here, if you need 
        this.waitFor = (ms) => new Promise(r => setTimeout(r, ms))
    }
    
    // This method used for get parameter which send from test file 
    getParam(arg) {
        let data = {}
        arg.forEach((datas) => {
            if(typeof datas == 'object') {
                data = Object.assign({}, datas)
                this.waitFor(50)
            }
        })
        return data
    }

    // This method will get function of expect from test file
    getExpectFunc(arg) {
        let expect
        arg.forEach((data) => {
            if (typeof data == "function") 
                expect = data
        })
        this.waitFor(50)
        return expect
    }

    // If your test using attachment, this method used for get parameter of attachment file like path and keys
    getAttach(arg) {
        let data = {}
        arg.forEach((datas) => {
                if(typeof datas == 'object') {
                    if(datas.hasOwnProperty('attachment')) {
                        data = Object.assign({}, datas.attachment)
                    }
                }
        })
        this.waitFor(50)
        return data
    }

    // If your test using attachment, this method used for get binary file from your computer
    getFile(data) {
        let file
        let name

        let path = data.split('/')
        name = path[path.length-1]
        file = fs.readFileSync(data)
       
        return [file, name]
    }

    // This method used for convert json file to json schema
    getSchema(json_responses, cases) {
        const options = {
            objects: {
                postProcessFnc: (schema, obj, defaultFnc) => ({...defaultFnc(schema, obj), required: Object.getOwnPropertyNames(obj)})
            }
        }

        if (json_responses.hasOwnProperty(cases)) {
            return toJsonSchema(json_responses[cases], options)
        } else {
            throw new Error('JSON Schema: '+cases+', does not exist!')
        }
        
    }

    // This method user for mapping keys object which you want to be change/replace the object
    objectMapping(obj, arg) {
        let map = arg[0]
        if (Object.keys(map).length > 0)
            // Define desired object
            Object.keys(map).forEach((key) => {
                Object.keys(obj).forEach((keyObj) => {
                    if(typeof obj[keyObj] != "object") {
                        if(keyObj == key) {
                            obj[key] = map[key]
                        }
                    } else {
                        if(keyObj == key) {
                            obj[key] = map[key]
                        }
                        if(Array.isArray(obj[keyObj])) {
                            obj[keyObj].forEach((objArr) => {
                                if (typeof Object.values(objArr)[0] != "object") {
                                    if (Object.keys(objArr)[0] == key)
                                        objArr[key] = map[key]
                                } else {
                                    (Object.values(objArr)[0]).forEach((dobjArr) => {
                                        if (typeof Object.values(dobjArr)[0] != "object") {
                                            if (Object.keys(dobjArr)[0] == key)
                                                dobjArr[key] = map[key]
                                    }
                                    })
                                }
                            })
                        } else {
                            if (typeof Object.values(obj[keyObj])[0] != "object") {
                                if (Object.keys(obj[keyObj])[0] == key)
                                    obj[keyObj][key] = map[key]
                            } else {
                                (Object.values(obj[keyObj])[0]).forEach((dobjArr) => {
                                    if (typeof Object.values(dobjArr)[0] != "object") {
                                        if (Object.keys(dobjArr)[0] == key)
                                            dobjArr[key] = map[key]
                                    }
                                })
                            }
                        }
                    }
                })
            })
        this.waitFor(100)
    }
}

module.exports = requestHelper