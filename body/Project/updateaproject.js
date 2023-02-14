class body {
  constructor(param_name="coba test") {
    this.value_name = param_name
  }
 
  request() {
    // Define desired object
    var obj = {
"name": this.param_name
}
    // Return it
    return obj
  }
}

module.exports = body