/// <reference types="cypress" />

describe('apiTestReqres', () => {
  const Base_URL = 'https://reqres.in/api';

  beforeEach('Verify status code', () => {
    cy.api('GET', `${Base_URL}/users?per_page=20`)
      .its('status')
      .should('be.eq', 200);
  });

  // it('Verify response has key "data"', () => {
  //   cy.api('GET', `${Base_URL}/users?per_page=2`)
  //     //.its('body')
  //     .then((response) => {
  //       console.log(response);
  //       expect(response.body).to.have.any.keys('data');
  //       expect(response.body.data).to.be.an('array');
  //       console.log(response.body.data);
  //     });
  // });

  it('Verify response has key "name"', () => {
    cy.api({
      method: 'POST',
      url: `${Base_URL}/users`,
      body: {
        name: 'morpheus',
        job: 'leader',
      },
    }).then((response) => {
      console.log(response);
      expect(response.body).to.have.any.keys('name');
      expect(response.body.name).to.be.eql('morpheus');
      expect(response.status).to.be.eql(201);
      console.log(response.body.name);
    });
  });

  it('Verify response has key "name"', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/users/475`,
    }).then((response) => {
      console.log(response);
      expect(response.body).to.have.any.keys('name');
      expect(response.body.id).to.be.eql('475');
      expect(response.status).to.be.eql(201);
      console.log(response.body.name);
    });
  });
});
