class body {
  constructor(param_name="Testing Todoist", param_testinimah="valuetest") {
    this.value_name = param_name,
this.value_testinimah = param_testinimah
  }
 
  request() {
    // Define desired object
    var obj = {
"name": this.value_name,
"testinimah": this.value_testinimah
}
    // Return it
    return obj
  }
}

module.exports = body