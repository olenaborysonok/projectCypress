/// <reference types="cypress" />

describe('apiTestReqres', () => {
  const Base_URL = 'https://simple-grocery-store-api.glitch.me';
  let product;
  let productId;
  let category = [
    'meat-seafood',
    'fresh-produce',
    'candy',
    'bread-bakery',
    'dairy',
    'eggs',
    'coffee',
  ];

  it('Verify status "UP"', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/status`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);
      expect(response.body.status).to.be.eql('UP');
    });
  });

  it('Verify all products have property', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/products`,
    }).then((response) => {
      expect(response.body).to.be.an('array');

      product = response.body;
      product.forEach((product) => {
        expect(product).to.be.an('object');
        expect(product).to.haveOwnProperty('id');
        expect(product.id).to.be.a('number');
        expect(product).to.haveOwnProperty('category');
        expect(product.category).to.be.a('string');
        expect(product).to.haveOwnProperty('name');
        expect(product.name).to.be.a('string');
        expect(product).to.haveOwnProperty('inStock');
        expect(product.inStock).to.be.an('boolean');
      });
      productId = response.body.map((el) => el.id);
      console.log(product);
      console.log(productId);
    });
  });

  category.forEach((category) => {
    it.only(`Verify product by Parameters: ${category}`, () => {
      cy.api({
        method: 'GET',
        url: `${Base_URL}/products`,
        qs: {
          // Parameters based on the API documentation
          category, // Example category
          results: 10, // Example number of results
          available: true, // Example availability
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');

        product = response.body;
        product.forEach((product) => {
          expect(product).to.be.an('object');
          expect(product).to.haveOwnProperty('id');
          expect(product.id).to.be.a('number');
          expect(product).to.haveOwnProperty('category');
          expect(product.category).to.be.a('string');
          expect(product).to.haveOwnProperty('name');
          expect(product.name).to.be.a('string');
          expect(product).to.haveOwnProperty('inStock');
          expect(product.inStock).to.be.an('boolean');
        });
      });
    });
  });
});
