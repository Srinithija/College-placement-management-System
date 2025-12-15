describe('Home Test', () => {
  it('loads homepage', () => {
    cy.visit('/index.html')
    cy.contains('Placement Management System')
  })
})
