describe('Sems', () => {
  it('can create object', () => {
    cy.visit('/')
    cy.contains('button', 'Erstelle Objekt').click();
  })
})
