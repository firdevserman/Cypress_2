const { defineConfig } = require('cypress');

module.exports = defineConfig ({ 
  e2e: {
    baseUrl: 'https://jsonplaceholder.typicode.com' ,
    specPattern: 'cypress/e2e/**/*.cy.js' ,
    video: false ,
    defaultCommandTimeout: 15000
    },
  }); 
