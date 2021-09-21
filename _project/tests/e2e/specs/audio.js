// https://docs.cypress.io/api/introduction/api.html

describe("Audio player", () => {
  it("should play audio", () => {
    cy.visit("/");
    cy.get(".song-link:first").click(); // Navigates to individual song page
    cy.wait(1000);
    cy.get("#play-button").click(); // Play the song
    cy.wait(5000);
    cy.get("#player-play-button").click(); // Pause the song
  });
});
