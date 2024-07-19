/// caution: uses the working place of the server! Do not run in parallel with other tests, that use it.
describe('sems', () => {
    // let url = 'http://localhost:5173/?local';
    //
    // beforeEach(() => {
    //     cy.visit(url);
    //     cy.contains('clear working place').click();
    // });
    //
    // it('can create detail of object', () => {
    //     cy.contains('new subitem').click();
    //     typeInFirstTextObject('parent');
    //     cy.contains('new subitem').click();
    //     cy.get(' .semsObject .head').eq(1).click();
    //     typeInTextObject(1, 'child');
    //     cy.contains('child');
    //     cy.get(' .semsObject .head').eq(1).click();
    //     cy.contains('child').should('not.exist');
    //     cy.visit(url);
    //     cy.get(' .semsObject .head').eq(1).click();
    //     cy.contains('child');
    // });
    //
    // it('at first object is collapsed', () => {
    //     cy.contains('new subitem').click();
    //     typeInFirstTextObject('parent');
    //     cy.contains('new subitem').click();
    //     cy.get(' .semsObject .head').eq(1).click();
    //     typeInTextObject(1, 'child');
    //     cy.wait(100);
    //     cy.visit(url);
    //     cy.wait(100);
    //     cy.contains('child').should('not.exist');
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