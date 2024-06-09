describe('sems', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.contains('clear working place').click();
  });

  it('can collapse commands', () => {
    cy.contains('new subitem');
    cy.contains('commands').click();
    cy.contains('new subitem').should('not.exist');
  });

  it('can create object', () => {
    cy.get('.semsObject .contentEditableDiv').should('not.exist');
    cy.contains('new subitem').click();
    typeInFirstTextObject('Hello World!');
    cy.get('.semsObject .contentEditableDiv').should("contain.text", 'Hello World!');
  });

  it('can store working place', () => {
    cy.contains('new subitem').click();
    let text = 'new object';
    typeInFirstTextObject(text);
    cy.wait(100); // TODO why is that necessary? How to make it smarter?
    cy.visit('http://localhost:5173');
    cy.get('.semsObject .contentEditableDiv').should("contain.text", text);
    cy.get('.semsObject .contentEditableDiv').should('have.length', 1);
  });

  it('can adapt cursor style of clickable element', () => {
    cy.contains('commands').should('have.css', 'cursor', 'pointer');
    cy.contains('commands').click();
    cy.contains('[...]').should('have.css', 'cursor', 'pointer');
  });

  it('can create detail of object', () => {
    cy.contains('new subitem').click();
    typeInFirstTextObject('parent');
    cy.contains('new subitem').click();
    typeInTextObject( 1, 'child');
    cy.contains('child');
    cy.get(' .semsObject .head').eq(1).click();
    cy.contains('child').should('not.exist');
  });
});

async function typeInFirstTextObject(text) {
  cy.get('.semsObject .contentEditableDiv').type(text);
  cy.get('.semsObject .contentEditableDiv').blur();
}

async function typeInTextObject(index, text) {
  cy.get('.semsObject .contentEditableDiv').eq(index).type(text);
  cy.get('.semsObject .contentEditableDiv').eq(index).blur();

}