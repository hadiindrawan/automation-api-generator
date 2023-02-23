const { faker } = require('@faker-js/faker')

class string {
    constructor() {
        // Write your constructor here, if you need 
    }

    randomUsername() {
        return "automationName" + faker.random.numeric(3)
    }
}

module.exports = string