describe("Successfully results for two investors", () => {
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
      "A deux",
      "Un investissement locatif",
      "Hébergé gratuitement",
      "Travailleur non salarié",
      "Depuis plus de 3 ans"
    );
    secondStep("5000", "2000", "1000", "1500");
    thirdStep("150", "100");
    fourthStep("9000", "20000");
    results1();
    cy.clearCookies();
  });

  it("Calculation for second case", () => {
    cy.findByText("A deux").click();
    cy.findByText("Votre résidence principale").click();
    cy.findByText("Locataire de votre logement").click();
    cy.findAllByPlaceholderText("Age").eq(0).clear().type("22");
    cy.findAllByPlaceholderText("Age").eq(1).clear().type("25");
    cy.findByText("Non").click();
    cy.findByPlaceholderText("Ex: 28 rue Beautreillis 75004 Paris")
      .clear()
      .type("210");
    cy.get('[role="option"]', { timeout: 1000 }).eq(0).click();
    cy.findAllByPlaceholderText("Loyer mensuel").type("500");
    cy.findAllByText("Travailleur non salarié").eq(0).click();
    cy.findAllByText("Depuis plus de 3 ans").eq(0).click();
    cy.findAllByText("Travailleur non salarié").eq(1).click();
    cy.findAllByText("Depuis plus de 3 ans").eq(1).click();
    cy.findByText("Suivant").should("not.be.disabled").click();
    secondStep("5000", "15000", "5000", "1500");
    thirdStep("150", "200");
    fourthStep("9000", "50000");
    results2();
  });

  it("Calculation for third case", () => {
    cy.findByText("A deux").click();
    cy.findByText("Votre résidence principale").click();
    cy.findByText("Hébergé gratuitement").click();
    cy.findAllByPlaceholderText("Age").eq(0).clear().type("22");
    cy.findAllByPlaceholderText("Age").eq(1).clear().type("25");
    cy.findByText("Non").click();
    cy.findByPlaceholderText("Ex: 28 rue Beautreillis 75004 Paris")
      .clear()
      .type("210");
    cy.get('[role="option"]', { timeout: 1000 }).eq(0).click();
    cy.findAllByText("Salarié du privé").eq(0).click();
    cy.findAllByText("En CDI").eq(0).click();
    cy.findAllByText("Hors période d'essai").eq(0).click();
    cy.findAllByText("Salarié du privé").eq(1).click();
    cy.findAllByText("En CDI").eq(1).click();
    cy.findAllByText("Hors période d'essai").eq(1).click();
    cy.findByText("Suivant").should("not.be.disabled").click();

    cy.findByPlaceholderText("Revenus nets mensuels").clear().type("2000");
    cy.findAllByText("Nb mois").eq(0).click();
    cy.get('[tabindex="-1"]').eq(0).click();
    cy.findAllByText("Oui").eq(0).click();
    cy.findAllByPlaceholderText("Primes annuelles").eq(0).clear().type("0");
    cy.findAllByPlaceholderText("Primes annuelles").eq(1).clear().type("10000");
    cy.findAllByPlaceholderText("Revenus nets mensuels")
      .eq(1)
      .clear()
      .type("2000");
    cy.findAllByText("Nb mois").eq(1).click();
    cy.get('[tabindex="-1"]').eq(0).click();
    cy.findAllByText("Non").eq(1).click();
    cy.findAllByText("Non").eq(2).click();
    cy.findByText("Suivant").should("not.be.disabled").click();
    thirdStep("500", "100");
    fourthStep("22222", "3000");
    results3();
  });

  it("Calculation for fourth case", () => {
    firstStep(
      "A deux",
      "Votre résidence principale",
      "Hébergé gratuitement",
      "Travailleur non salarié",
      "Depuis plus de 3 ans"
    );
    secondStep("1000", "2000", "1500", "1200");
    thirdStep("1500", "2000");
    fourthStep("22222", "3000");
    results4();
  });
});

function firstStep(type1, property, situation, situation2, precisely) {
  cy.findByText(type1).click();
  cy.findByText(property).click();
  cy.findByText(situation).click();
  cy.findAllByPlaceholderText("Age").eq(0).clear().type("22");
  cy.findAllByPlaceholderText("Age").eq(1).clear().type("25");
  cy.findByText("Non").click();
  cy.findByPlaceholderText("Ex: 28 rue Beautreillis 75004 Paris")
    .clear()
    .type("200");
  cy.get('[role="option"]', { timeout: 1000 }).eq(0).click();
  cy.findAllByText(situation2).eq(0).click();
  cy.findAllByText(precisely).eq(0).click({ force: true });
  cy.findAllByText(situation2).eq(1).click();
  cy.findAllByText(precisely).eq(1).click({ force: true });
  cy.findByText("Suivant").should("not.be.disabled").click();
}

function secondStep(monthlyNetIncome1, bonus1, bonus2, monthlyNetIncome2) {
  cy.findByPlaceholderText("Revenus nets mensuels")
    .clear()
    .type(monthlyNetIncome1);
  cy.findByText("Nb mois").click();
  cy.get('[tabindex="-1"]').eq(0).click();
  cy.findAllByText("Oui").eq(0).click();
  cy.findAllByPlaceholderText("Primes annuelles").eq(0).clear().type(bonus1);
  cy.findAllByPlaceholderText("Primes annuelles").eq(1).clear().type(bonus2);
  cy.findAllByText("Non").eq(1).click();
  cy.findAllByPlaceholderText("Revenus nets mensuels")
    .eq(1)
    .clear()
    .type(monthlyNetIncome2);
  cy.findAllByText("Nb mois").eq(1).click();
  cy.get('[tabindex="-1"]').eq(0).click();
  cy.findAllByText("Non").eq(2).click();
  cy.findAllByText("Non").eq(3).click();
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
  cy.get('[class="styles__OverviewCardContainer-sc-o8j682-0 iYckIg"]')
    .eq(0)
    .children()
    .should("have.length", 4);
  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(0)
    .contains("Votre capacité d’emprunt sur 20 ans");
  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(1)
    .contains("Votre remboursement d’emprunt");
  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(2)
    .contains("Votre locataire vous remboursera");
}

function results2() {
  cy.url().should("include", "/mortgage-calculator/result", {
    timeout: 10000,
  });
  cy.get('[class="styles__OverviewCardsContainer-sc-c90lrf-1 hAGWrL"]')
    .eq(0)
    .children()
    .should("have.length", 2);
  cy.get('[class="styles__OverviewCardContainer-sc-o8j682-0 iYckIg"]')
    .eq(0)
    .children()
    .should("have.length", 4);
  cy.get('[class="styles__OverviewCardContainer-sc-o8j682-0 iYckIg"]')
    .eq(1)
    .children()
    .should("have.length", 4);

  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(0)
    .contains("Votre capacité d’emprunt sur 20 ans");
  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(1)
    .contains("Votre remboursement d’emprunt");
  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(2)
    .contains("Votre locataire vous remboursera");

  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(3)
    .contains("Votre capacité d’emprunt sur 25 ans");
  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(4)
    .contains("Votre remboursement d’emprunt");
  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(5)
    .contains("Votre locataire vous remboursera");
}

function results3() {
  cy.url().should("include", "/mortgage-calculator/result", {
    timeout: 10000,
  });
  cy.get('[class="styles__OverviewCardsContainer-sc-c90lrf-1 hAGWrL"]')
    .eq(0)
    .children()
    .should("have.length", 1);
  cy.get('[class="styles__OverviewCardContainer-sc-o8j682-0 iYckIg"]')
    .eq(0)
    .children()
    .should("have.length", 3);
  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(0)
    .contains("Votre capacité d’emprunt sur 25 ans");
  cy.get('[class="styles__OverviewRowContainer-sc-xdxkzf-0 bHJvsf"]')
    .eq(1)
    .contains("Votre remboursement d’emprunt");
}

function results4() {
  cy.url().should("include", "/mortgage-calculator/result", {
    timeout: 10000,
  });
  cy.get('[class="styles__RejectCardContainer-sc-a1qy4r-1 ARDvD"]')
    .eq(0)
    .children()
    .should("have.length", 1);
  cy.get('[class="styles__ListOfReasons-sc-a1qy4r-3 kCXPRE"]').contains(
    "Apport insuffisant"
  );
}
