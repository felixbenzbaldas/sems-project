describe('sems', () => {

  it('can collapse commands', () => {
    cy.visit('http://localhost:5173');
    cy.get('.semsObject button').should('exist');
    cy.contains('commands').click();
    cy.get('.semsObject button').should('not.exist');
  });

  it('can create object', () => {
    cy.visit('http://localhost:5173');
    cy.contains('clear working space').click();
    cy.get('.semsObject .contentEditableDiv').should('not.exist');
    cy.contains('new subitem').click();
    cy.get('.semsObject .contentEditableDiv').should('exist');
    cy.get('.semsObject .contentEditableDiv').type('Hello World');
    cy.get('.semsObject .contentEditableDiv').should("contain.text", 'Hello World');
    cy.contains('Hello World');
  });

  it('can store working space', () => {
    cy.visit('http://localhost:5173');
    cy.contains('clear working space').click();
    cy.contains('new subitem').click();
    let text = 'new object';
    cy.get('.semsObject .contentEditableDiv').type(text);
    cy.get('.semsObject .contentEditableDiv').should("contain.text", text);
    cy.get('.semsObject .contentEditableDiv').blur();
    cy.visit('http://localhost:5173');
    cy.get('.semsObject .contentEditableDiv').should("contain.text", text);
    cy.get('.semsObject .contentEditableDiv').should('have.length', 1);
  });

  it('can adapt cursor style of clickable element', () => {
    cy.visit('http://localhost:5173');
    cy.contains('commands').should('have.css', 'cursor', 'pointer');
    cy.contains('commands').click();
    cy.contains('[...]').should('have.css', 'cursor', 'pointer');
  });

  // TODO
  // it('can create detail of object', () => {
  //   cy.visit('http://localhost:5173');
  //   cy.contains('clear working space').click();
  //   cy.contains('new subitem').click();
  //   cy.get('.semsObject .contentEditableDiv').type('parent');
  //   cy.get('.semsObject .contentEditableDiv').blur();
  //   cy.contains('new subitem').click();
  //   cy.get('.semsObject .contentEditableDiv').each((item, index) => {
  //     if (index === 1) {
  //       item.get().at(0).innerText = 'child';
  //     }
  //   });
  //   cy.contains('parent').click();
  //   cy.contains('child').should('not.contain', 'child');
  // });

});