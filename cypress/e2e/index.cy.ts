describe("App loads", () => {
  it("displays landing page", () => {
    cy.visit("/");
    cy.contains("p", "Effortlessly Manage").should("be.visible");
  });
});
