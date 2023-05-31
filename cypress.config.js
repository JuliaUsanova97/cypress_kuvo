const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  viewportWidth: 1920,
  viewportHeight: 1080,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "**/*.{js,jsx,ts,tsx}",
    excludeSpecPattern: "cypress/support/**/*.{js,jsx,ts,tsx}",
  },
});
