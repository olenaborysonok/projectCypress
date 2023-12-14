/// <reference types="cypress" />

describe('apiTestReqres', () => {
  const Base_URL = 'https://simple-grocery-store-api.glitch.me';
  let product;
  let productId;
  let actualCategory;
  let actualResults;
  let category = [
    'coffee',
    'fresh-produce',
    'meat-seafood',
    'candy',
    'dairy',
    'bread-bakery',
    'eggs',
  ];
  let results = [-1, 1, 2, 3, 5, 10, 15, 20, 21];

  it('Verify status "UP"', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/status`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);
      expect(response.body.status).to.be.eql('UP');
    });
  });

  it('Verify product has all category', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/products`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);

      actualCategory = response.body
        .map((el) => el.category)
        .filter((value, index, self) => self.indexOf(value) === index);

      console.log(actualCategory);

      expect(category).to.deep.equal(actualCategory);

      //   productId = response.body.map((el) => el.id);
      //   console.log(productId);

      //   actualCategory = response.body
      //     .filter((el) => el.category === 'coffee')
      //     .map((el) => el.id);
      //   console.log(actualCategory);
    });
  });

  category.forEach((category) => {
    it.only(`Verify products have own property by category Parameters: ${category}`, () => {
      cy.api({
        method: 'GET',
        url: `${Base_URL}/products`,
        qs: {
          // Parameters based on the API documentation
          category, // Example category
          //results: 20, // Example number of results
          //available: false, // Example availability
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');

        product = response.body;
        console.log(product);

        product.forEach((product) => {
          expect(product).to.be.an('object');
          expect(product).to.haveOwnProperty('id');
          expect(product.id).to.be.a('number');
          expect(product).to.haveOwnProperty('category', category);
          expect(product.category).to.be.a('string');
          expect(product).to.haveOwnProperty('name');
          expect(product.name).to.be.a('string');
          expect(product).to.haveOwnProperty('inStock');
          expect(product.inStock).to.be.an('boolean');
        });
      });
    });
  });

  results.forEach((results) => {
    it(`Verify result of listed products in the page by Result Parameters: ${results}`, () => {
      cy.api({
        method: 'GET',
        url: `${Base_URL}/products`,
        qs: {
          results, // Example number of results
          available: true, // Example availability
        },
        failOnStatusCode: false, // Ignore non-2xx status codes
      }).then((response) => {
        actualResults = response.body.length;
        console.log(actualResults);
        console.log(results);

        if (results >= 0 && results <= 20) {
          expect(response.body).to.be.an('array');
          expect(response.status).to.equal(200);
          expect(results).to.deep.equal(actualResults);
        } else {
          expect(response.body).to.be.an('object');
          expect(response.status).to.equal(400);
          expect(response.body.error).to.include(
            "Invalid value for query parameter 'results'."
          );
        }
      });
    });
  });

  it('Verify category: eggs', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/products`,
      qs: {
        category: 'eggs',
        results: 21,
        available: true,
      },
    }).then((response) => {
      expect(response.status).to.be.eql(200);
      expect(response.body).to.be.an('array');

      product = response.body;
      console.log(product);

      product.forEach((product) => {
        expect(product).to.haveOwnProperty('id');
        expect(product.id).to.be.a('number');
        expect(product).to.haveOwnProperty('category', 'eggs');
        expect(product.category).to.be.a('string');
        expect(product).to.haveOwnProperty('name');
        expect(product.name).to.be.a('string');
        expect(product).to.haveOwnProperty('inStock');
        expect(product.inStock).to.be.an('boolean');
      });
    });
  });
});
