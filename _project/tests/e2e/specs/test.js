// https://docs.cypress.io/api/introduction/api.html

describe("sanity check", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Listen to Great Music!");
  });
});
