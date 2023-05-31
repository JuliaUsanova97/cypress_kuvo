import { gql } from "@apollo/client";
import { client } from "../../src/graphql-client";
import { rentControl } from "../../../cypress/e2e/lib/functions";

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

  it("creates one item", () => {
    return cy.then(() => {
      const address = "200 Quai de Valmy, Paris, France";
      const constructionPeriod = "newest";
      const furnished = false;
      const numberOfRooms = 1;
      const surfaceArea = 55;
      const query = `query AreaParamsByAddress($data: CapRentRequest!)`;
      const graphQLClient = new GraphQLClient(
        `${Cypress.env("DASHBOARD_API_URL")}/graphql`,
        {
          query,
          variables: {
            data: {
              address,
              constructionPeriod,
              furnished,
              numberOfRooms,
              surfaceArea,
            },
          },
        }
      );

      return cy.wrap(graphQLClient.request(query, variables), {
        timeout: DEFAULT_TIMEOUT,
        log: false,
      });
    });

    //cy.visit(`${Cypress.env("WEBSITE_URL")}/rent-control`);
  });
});
