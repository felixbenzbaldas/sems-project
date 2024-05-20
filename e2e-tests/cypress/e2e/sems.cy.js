describe('sems', () => {
  it('can create object', () => {
    cy.visit('http://localhost:5173');
    cy.get('.semsObject').should('not.exist');
    cy.contains('new subitem').click();
    cy.get('.semsObject > input').should('exist');
  });
});