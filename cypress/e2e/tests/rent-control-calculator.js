describe("Successfully results for one investor", () => {
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

    cy.visit(`${Cypress.env("WEBSITE_URL")}/rent-control`);
    cy.contains("button", "Accepter et fermer", { timeout: 10000 }).click();
  });

  it("Successfully submit rent-control", () => {
    cy.contains("Calculez votre loyer encadré à Paris");
    cy.findAllByPlaceholderText("Adresse").type("200");
    cy.get('[role="option"]', { timeout: 1000 }).eq(0).click();
    cy.get('[for="numberOfRooms-1"]').click();
    cy.findAllByPlaceholderText("Surface").type("55");
    cy.findByText("Période").click();
    cy.get("#react-select-5-option-3").click();
    cy.findByText("Vide").click();
    cy.findByText("Résultats").should("not.be.disabled").click();

    cy.url().should("include", "/rent-control/results", {
      timeout: 10000,
    });
    cy.get('[class="styles__Rent-sc-1p8vcxq-3 fveiKb"]').should(
      "contain",
      "1603"
    );
    cy.get('[class="styles__ResultsContainer-sc-cwpsyg-2 hiygNZ"]')
      .children()
      .eq(0)
      .should("have.text", "29,2 €");
    cy.get('[class="styles__ResultsContainer-sc-cwpsyg-2 hiygNZ"]')
      .children()
      .eq(1)
      .should("have.text", "24,3 €");
    cy.get('[class="styles__ResultsContainer-sc-cwpsyg-2 hiygNZ"]')
      .children()
      .eq(2)
      .should("have.text", "17,0 €");

    cy.clearCookies();
  });
});
