describe('sems', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173');
    });

    it('can show text', () => {
        cy.contains('Sems');
    });
});