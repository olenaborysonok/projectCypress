/// <reference types="cypress" />

import footerDataMenuParam from '../fixtures/footerDataMenuParam.json';

describe('sideMenuParam', function () {
  beforeEach(function () {
    cy.get('button.jenkins_ver').click();
    cy.get('.jenkins-dropdown__item').as('footerMenuLink');
  });

  footerDataMenuParam.footerMenuName.forEach((linkName, ind) => {
    it(`Verify side menu link ${linkName} functionality`, function () {
      cy.wrap(this.footerMenuLink[ind]).click();
      //cy.url().should('contain', footerDataMenuParam.endPointsSideMenu[ind]);
      cy.origin(footerDataMenuParam.endPointsMenuName[ind], () => {
        cy.get(footerDataMenuParam.selectors[ind]).invoke('text');
      }).should('include', footerDataMenuParam.headerPage[ind]);

      //   cy.origin(footerDataMenuParam.endPointsMenuName[ind], () => {
      //     cy.get(footerDataMenuParam.selectors[ind]).invoke('text');
      //   }).should('include', footerDataMenuParam.headerPage[ind]);
      //   cy.contains(sideMenu.headerPage[ind]);
    });
  });

  //   it('US_15.03.001 | Verify Jenkins version in Footer and color', () => {
  //     cy.get('.jenkins_ver')

  //       .should('be.visible')
  //       .and('have.text', footerData.jenkinsVersion)
  //       .and('have.css', 'color', 'rgb(20, 20, 31)');
  //   });

  //   it('US_15.03.002|Verify dropdown option "Website" navigation to a new page', () => {
  //     cy.get('button.jenkins_ver').click();
  //     cy.get('a.jenkins-dropdown__item[href = "https://www.jenkins.io/"]')
  //       .invoke('removeAttr', 'target')
  //       .click();

  //     cy.origin('https://www.jenkins.io/', () => {
  //       cy.get('h1.page-title span').invoke('text');
  //     }).should('include', footerDataMenuParam.headerPage);
  //   });

  //   it('US_15.03.003 |Verify dropdown option "Get involved" navigation to a new page', () => {
  //     cy.get('.page-footer__links button.jenkins-button').click();
  //     cy.get(
  //       'a.jenkins-dropdown__item[href="https://www.jenkins.io/participate/"]'
  //     )
  //       .invoke('removeAttr', 'target')
  //       .click();

  //     cy.origin('https://www.jenkins.io/participate/', () => {
  //       cy.get('div.col-md-12 h1').invoke('text');
  //     }).should('include', footerDataMenuParam.headerPage);

  //     // let sent = { title: footerData.participatePageHeader };
  //     // cy.origin(
  //     //   'https://www.jenkins.io/participate/',
  //     //   { args: sent },
  //     //   ({ title }) => {
  //     //     cy.get('div.col-md-12 h1').invoke('text').should('include', title);
  //     //   }
  //     // );
  //   });
});
