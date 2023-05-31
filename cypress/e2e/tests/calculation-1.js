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

    cy.visit(`${Cypress.env("WEBSITE_URL")}/mortgage-calculator`);
    cy.contains("button", "Accepter et fermer", { timeout: 7000 }).click();
    cy.contains("button", "Réinitialiser").click();
  });

  it("Calculation for first case", () => {
    firstStep(
      "Seul",
      "Un investissement locatif",
      "Hébergé gratuitement",
      "Travailleur non salarié",
      "Depuis plus de 3 ans"
    );
    secondStep("5000", "2000", "1000");
    thirdStep("150", "100");
    fourthStep("9000", "20000");
    results1();
    cy.clearCookies();
  });

  it("Calculation for second case", () => {
    cy.findByText("Seul").click();
    cy.findByText("Votre résidence principale").click();
    cy.findByText("Locataire de votre logement").click();
    cy.findByPlaceholderText("Age").clear().type("22");
    cy.findByText("Non").click();
    cy.findByPlaceholderText("Ex: 28 rue Beautreillis 75004 Paris")
      .clear()
      .type("210");
    cy.get('[role="option"]', { timeout: 1000 }).eq(0).click();
    cy.findByPlaceholderText("Loyer mensuel").type("200");
    cy.findByText("Travailleur non salarié").click();
    cy.findByText("Depuis plus de 3 ans").click({ force: true });
    cy.findByText("Suivant").should("not.be.disabled").click();
    secondStep("10000", "150", "200");
    thirdStep("200", "100");
    fourthStep("9000", "70000");
    results2();
  });

  it("Calculation for third case", () => {
    cy.findByText("Seul").click();
    cy.findByText("Votre résidence principale").click();
    cy.findByText("Hébergé gratuitement").click();
    cy.findByPlaceholderText("Age").clear().type("22");
    cy.findByText("Non").click();
    cy.findByPlaceholderText("Ex: 28 rue Beautreillis 75004 Paris")
      .clear()
      .type("210");
    cy.get('[role="option"]', { timeout: 1000 }).eq(0).click();
    cy.findByText("Salarié du privé").click();
    cy.findByText("En CDI").click();
    cy.findByText("Hors période d'essai").click({ force: true });
    cy.findByText("Suivant").should("not.be.disabled").click();
    secondStep("2000", "1000", "20000");
    thirdStep("500", "100");
    fourthStep("22222", "3000");
    results3();
  });

  it("Calculation for fourth case", () => {
    firstStep(
      "Seul",
      "Votre résidence principale",
      "Hébergé gratuitement",
      "Travailleur non salarié",
      "Depuis plus de 3 ans"
    );
    secondStep("2000", "2000", "10000");
    thirdStep("1000", "1500");
    fourthStep("22222", "3000");
    results4();
  });
});

function firstStep(type1, property, situation, situation2, precisely) {
  cy.findByText(type1).click();
  cy.findByText(property).click();
  cy.findByText(situation).click();
  cy.findByPlaceholderText("Age").clear().type("22");
  cy.findByText("Non").click();
  cy.findByPlaceholderText("Ex: 28 rue Beautreillis 75004 Paris")
    .clear()
    .type("200");
  cy.get('[role="option"]', { timeout: 1000 }).eq(0).click();
  cy.findByText(situation2).click();
  cy.findByText(precisely).click({ force: true });
  cy.findByText("Suivant").should("not.be.disabled").click();
}

function secondStep(monthlyNetIncome, bonus1, bonus2) {
  cy.findByPlaceholderText("Revenus nets mensuels")
    .clear()
    .type(monthlyNetIncome);
  cy.findByText("Nb mois").click();
  cy.get('[tabindex="-1"]').eq(0).click();
  cy.findAllByText("Oui").eq(0).click();
  cy.findAllByPlaceholderText("Primes annuelles").eq(0).clear().type(bonus1);
  cy.findAllByPlaceholderText("Primes annuelles").eq(1).clear().type(bonus2);
  cy.findAllByText("Non").eq(1).click();
  cy.findByText("Suivant").should("not.be.disabled").click();
}

function thirdStep(repayment1, repayment2) {
  cy.findAllByText("Oui").eq(0).click();
  cy.findAllByText("Crédit immobilier").click();
  cy.findAllByText("Crédit consommation").click();
  cy.findAllByPlaceholderText("Montant par mois")
    .eq(0)
    .clear()
    .type(repayment1);
  cy.wait(100);
  cy.findAllByPlaceholderText("Montant par mois")
    .eq(1)
    .clear()
    .type(repayment2);
  cy.findAllByText("Non").eq(1).click();
  cy.findByText("Suivant").should("not.be.disabled").click();
}

function fourthStep(netValue, maximumDownpayment) {
  cy.findByText("Montant moyen").click();
  cy.get('[tabindex="-1"]').eq(1).click();
  cy.findByPlaceholderText("Valeur nette").type(netValue);
  cy.findByPlaceholderText("Apport maximum").type(maximumDownpayment);
  cy.findByText("Suivant").should("not.be.disabled").click();
}

function results1() {
  cy.url().should("include", "/mortgage-calculator/result", {
    timeout: 10000,
  });
  cy.get('[class="styles__OverviewCardsContainer-sc-c90lrf-1 hAGWrL"]')
    .eq(0)
    .children()
    .should("have.length", 1);
  cy.get('[class="styles__OverviewRowsContainer-sc-1eo7w0k-0 evpIme"]')
    .eq(0)
    .children()
    .should("have.length", 3);
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(0)
    .contains("Votre budget total");
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(1)
    .contains("Votre remboursement d’emprunt");
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(2)
    .contains("Loyer payé par votre locataire");
}

function results2() {
  cy.url().should("include", "/mortgage-calculator/result", {
    timeout: 10000,
  });
  cy.get('[class="styles__OverviewCardsContainer-sc-c90lrf-1 hAGWrL"]')
    .eq(0)
    .children()
    .should("have.length", 2);
  cy.get('[class="styles__OverviewRowsContainer-sc-1eo7w0k-0 evpIme"]')
    .eq(0)
    .children()
    .should("have.length", 3);
  cy.get('[class="styles__OverviewRowsContainer-sc-1eo7w0k-0 evpIme"]')
    .eq(1)
    .children()
    .should("have.length", 3);

  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(0)
    .contains("Votre budget total");
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(1)
    .contains("Votre remboursement d’emprunt");
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(2)
    .contains("Loyer payé par votre locataire");

  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(3)
    .contains("Votre budget total");
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(4)
    .contains("Votre remboursement d’emprunt");
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(5)
    .contains("Vous n’avez pas de locataire");
}

function results3() {
  cy.url().should("include", "/mortgage-calculator/result", {
    timeout: 10000,
  });
  cy.get('[class="styles__OverviewCardsContainer-sc-c90lrf-1 hAGWrL"]')
    .eq(0)
    .children()
    .should("have.length", 2);
  cy.get('[class="styles__OverviewRowsContainer-sc-1eo7w0k-0 evpIme"]')
    .eq(0)
    .children()
    .should("have.length", 3);
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(0)
    .contains("Votre budget total");
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(1)
    .contains("Votre remboursement d’emprunt");
  cy.get('[class="styles__OverviewRowContainer-sc-1kxx42t-0 gvOxsU"]')
    .eq(2)
    .contains("Vous n’avez pas de locataire");
}

function results4() {
  cy.url().should("include", "/mortgage-calculator/result", {
    timeout: 10000,
  });
  cy.get('[class="styles__RejectCardContainer-sc-a1qy4r-1 beZzoD"]')
    .eq(0)
    .children()
    .should("have.length", 1);
  cy.get('[class="styles__ListOfReasons-sc-a1qy4r-3 kCXPRE"]').contains(
    "Capacité d’emprunt trop faible"
  );
}
