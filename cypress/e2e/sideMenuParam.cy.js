import sideMenu from '../fixtures/sideMenu.json';

describe('sideMenuParam', function () {
  beforeEach(function () {
    cy.get('#side-panel #tasks a').as('sideMenuLink');
  });

  sideMenu.sideMenuName.forEach((linkName, ind) => {
    it(`Verify side menu link ${linkName} functionality`, function () {
      cy.wrap(this.sideMenuLink[ind]).click();

      cy.url().should('contain', sideMenu.endPointsSideMenu[ind]);
      cy.contains(sideMenu.headerPage[ind]);
    });
  });
});
