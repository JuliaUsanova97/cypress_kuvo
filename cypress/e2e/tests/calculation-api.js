describe("Successfully logs in from api", () => {
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: Cypress.env("API_URL"),

      headers: {
        "Content-Type": "application/json",
        "auth-method": "email",
      },
      body: {
        email: Cypress.env("EMAIL"),
        password: Cypress.env("PASSWORD"),
      },
    }).then((response) => {
      cy.setCookie("jwt-token", response.body.token);
    });
    cy.reload();
  });

    it("Calculation api", () => {
      cy.intercept('POST', 'https://beanstock.com/graphql', (req) => {
        if (req.body.operationName === 'createMutation') {
          req.alias = 'createMutation';
          req.continue();
        }
      });

      cy.intercept('POST', 'https://beanstock.com/graphql', (req) => {
        if (req.body.operationName === 'AreaParamsByAddress') {
          req.alias = 'AreaParamsByAddress';
          req.continue();
        }
      });

      cy.visit(`${Cypress.env("WEBSITE_URL")}/rent-control`);
      cy.wait('@AreaParamsByAddress');
    });


 


});

