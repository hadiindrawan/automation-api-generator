class requestHelper {
    constructor() {
        // Write your constructor here, if you need 
    }
    
    getParams(arg) {
        let data = Object.assign({}, arg)
        delete data.response
        return data
    }

    getExpectFunc(arg) {
        let expect
        arg.forEach((data) => {
            if (typeof data == "function") 
                expect = data
        })
        return expect
    }

    objectMapping(obj, map) {
        // Define desired object
        Object.keys(map).forEach((key) => {
            Object.keys(obj).forEach((keyObj) => {
                if(typeof obj[keyObj] != "object") {
                        if(keyObj == key) {
                            obj[key] = map[key]
                        }
                    } else {
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
    }
}

module.exports = requestHelper