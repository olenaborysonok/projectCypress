/// <reference types="cypress" />

describe('apiTestReqres', () => {
  const Base_URL = 'https://simple-grocery-store-api.glitch.me';
  let singleProduct;
  let product;
  let productId;
  let prodId;
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

  it('Verify all category has product', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/products`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);

      actualCategory = response.body
        .map((el) => el.category)
        .filter((value, index, self) => self.indexOf(value) === index);

      console.log(category);
      console.log(actualCategory);

      expect(category).to.deep.equal(actualCategory);

      //   productId = response.body.map((el) => el.id);
      //   console.log(productId);

      //   actualId = response.body
      //     .filter((el) => el.category === 'coffee')
      //     .map((el) => el.id);
      //   console.log(actualCategory);
    });
  });

  category.forEach((category) => {
    it(`Verify products have own property by category Parameters: ${category}`, () => {
      cy.api({
        method: 'GET',
        url: `${Base_URL}/products`,
        qs: {
          // Parameters based on the API documentation
          category, // Example category
          //results: 20, // Example number of results
          //available: true, // Example availability
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
    it.only(`Verify result of listed products in the page by Result Parameters: ${results}`, () => {
      cy.api({
        method: 'GET',
        url: `${Base_URL}/products`,
        qs: {
          results, // Example number of results
          //available: true, // Example availability
        },
        failOnStatusCode: false, // Ignore non-2xx status codes
      }).then((response) => {
        actualResults = response.body.length;
        console.log(actualResults);
        console.log(results);

        if (results >= 0 && results <= 20) {
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an('array');
          expect(results).to.deep.equal(actualResults);
        } else {
          expect(response.status).to.equal(400);
          expect(response.body).to.be.an('object');
          if (results < 0) {
            expect(response.body.error).to.eql(
              "Invalid value for query parameter 'results'. Must be greater than 0."
            );
          }
          if (results > 20) {
            expect(response.body.error).to.eql(
              "Invalid value for query parameter 'results'. Cannot be greater than 20."
            );
          }
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
        results: 20,
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

  it('Verify At list one available product exist', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/products`,
    }).then((response) => {
      singleProduct = response.body.find(
        (el) => el.name === 'Ethical Bean Medium Dark Roast, Espresso'
      );
      console.log(singleProduct);
      expect(response.status).to.be.eql(200);
      expect(singleProduct).to.be.an('object');
      expect(singleProduct).to.haveOwnProperty('id');
      expect(singleProduct.id).to.be.a('number');
      expect(singleProduct).to.haveOwnProperty('category');
      expect(singleProduct.category).to.be.a('string');
      expect(singleProduct).to.haveOwnProperty(
        'name',
        'Ethical Bean Medium Dark Roast, Espresso'
      );
      expect(singleProduct.name).to.be.a('string');
      expect(singleProduct).to.haveOwnProperty('inStock');
      expect(singleProduct.inStock).to.be.an('boolean');

      productId = singleProduct.id;
      // console.log(productId);
    });
  });

  prodId = [productId, -1];
  prodId.forEach((prodId) => {
    it(`Verify single product by Id ${prodId}`, () => {
      cy.api({
        method: 'GET',
        url: `${Base_URL}/products/${prodId}`,
        qs: {
          'product-label': true,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (prodId === productId) {
          expect(response.status).to.equal(200);
        } else {
          expect(response.status).to.equal(404);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.include('No product with id -1.');
        }

        console.log(prodId);
      });
    });
  });
});
