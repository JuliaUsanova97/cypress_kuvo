export function rentControl() {
  return websiteGqlRequest({
    mutation: signInMutation,
    data: {
      params: {
        address,
        constructionPeriod,
        furnished,
        numberOfRooms,
        surfaceArea,
      },
    },
    withAuthorizationToken: false,
  }).then((res) => {
    Cypress.env("access_token", res.signIn.accessToken);
    cy.setCookie("access-token", res.signIn.accessToken);
  });
}
