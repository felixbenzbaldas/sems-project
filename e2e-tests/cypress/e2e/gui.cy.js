
/// test the graphical-user-interface (gui)
/// caution: uses the working place of the server! Do not run in parallel with other tests, that use it.
describe('gui', () => {
    // let url = 'http://localhost:5173/?local';
    //
    // beforeEach(() => {
    //     cy.visit(url);
    //     cy.contains('clear working place').click();
    // });
    //
    // it('can collapse commands', () => {
    //     cy.contains('new subitem');
    //     cy.contains('commands').click();
    //     cy.contains('new subitem').should('not.exist');
    // });
    //
    // it('can create object', () => {
    //     cy.get('.semsObject .contentEditableDiv').should('not.exist');
    //     cy.contains('new subitem').click();
    //     typeInFirstTextObject('Hello World!');
    //     cy.get('.semsObject .contentEditableDiv').should("contain.text", 'Hello World!');
    // });
    //
    // it('can adapt cursor style of clickable element', () => {
    //     cy.contains('commands').should('have.css', 'cursor', 'pointer');
    //     cy.contains('commands').click();
    //     cy.contains('[...]').should('have.css', 'cursor', 'pointer');
    // });
});


async function typeInFirstTextObject(text) {
    cy.get('.semsObject .contentEditableDiv').type(text);
    cy.get('.semsObject .contentEditableDiv').blur();
}

async function typeInTextObject(index, text) {
    cy.get('.semsObject .contentEditableDiv').eq(index).type(text);
    cy.get('.semsObject .contentEditableDiv').eq(index).blur();
}