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
  let cartId;
  let itemId;
  let item;
  let newItem;
  let itemQuantity;
  let randomQuantity = (() => {
    return Math.floor(Math.random() * 10) + 1; // Generates a random number between 1 and 10
  })();

  let clientName = 'Olena';
  let randomClientEmail = (() => {
    let randomString = Math.random().toString(36).substring(7);
    return `user_${randomString}@example.com`;
  })();
  let token;
  let clientEmail = [randomClientEmail, 'olena@gmail.com'];
  let orderId;

  it.skip('TC_00.01_Verify status "UP"', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/status`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);
      expect(response.body.status).to.be.eql('UP');
    });
  });

  it.skip('TC_00.02_Verify all category has product', () => {
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
    it.skip(`TC_00.03_Verify products have own property by category Parameters: ${category}`, () => {
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
    it.skip(`TC_00.04_Verify result of listed products in the page by Result Parameters: ${results}`, () => {
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

  it.skip('TC_00.05_Verify category: eggs', () => {
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

  it('TC_00.06_Verify at list one available product exist', () => {
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

  it(`TC_00.07_Verify single product by Id ${productId}`, () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/products/${productId}`,
      qs: {
        'product-label': true,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.haveOwnProperty(
        'name',
        'Ethical Bean Medium Dark Roast, Espresso'
      );

      console.log(productId);
    });
  });

  prodId = [productId, -1];

  //   prodId.forEach((prodId) => {
  //     it.only(`Verify single product by Id ${prodId}`, () => {
  //       cy.api({
  //         method: 'GET',
  //         url: `${Base_URL}/products/${prodId}`,
  //         qs: {
  //           'product-label': true,
  //         },
  //         failOnStatusCode: false,
  //       }).then((response) => {
  //         if (prodId === productId) {
  //           expect(response.status).to.equal(200);
  //         } else {
  //           expect(response.status).to.equal(404);
  //           expect(response.body).to.be.an('object');
  //           expect(response.body.error).to.include('No product with id -1.');
  //         }

  //         console.log(prodId);
  //         console.log(productId);
  //       });
  //     });
  //   });

  it('TC_00.08_Verify new cart is created', () => {
    cy.api({
      method: 'POST',
      url: `${Base_URL}/carts`,
    }).then((response) => {
      expect(response.status).to.be.eql(201);
      expect(response.body).to.be.an('object');
      expect(response.body).to.haveOwnProperty('created');
      expect(response.body.created).to.be.true;
      expect(response.body).to.haveOwnProperty('cartId');
      expect(response.body.cartId).to.be.a('string');

      cartId = response.body.cartId;
      console.log(cartId);
    });
  });

  it('TC_00.09_Verify cartId', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/carts/${cartId}`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.haveOwnProperty('items');
      expect(response.body.items).to.be.an('array');
      expect(response.body).to.haveOwnProperty('created');
      expect(response.body.created).to.be.a('string');

      console.log(cartId);
    });
  });

  it('TC_00.10_Verify item added to the cart', () => {
    cy.api({
      method: 'POST',
      url: `${Base_URL}/carts/${cartId}/items`,
      body: {
        productId,
        quantity: 3,
      },
    }).then((response) => {
      expect(response.status).to.be.eql(201);
      expect(response.body).to.be.an('object');
      expect(response.body).to.haveOwnProperty('created');
      expect(response.body.created).to.be.true;
      expect(response.body.itemId).to.be.a('number');

      itemId = response.body.itemId;

      console.log(itemId);
    });
  });

  it('TC_00.11_Verify cart items after item added to the carts', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/carts/${cartId}/items`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);
      expect(response.body).to.be.an('array');

      item = response.body;
      console.log(item);

      item.forEach((item) => {
        expect(item).to.be.an('object');
        expect(item).to.haveOwnProperty('id');
        expect(item.id).to.be.eql(itemId);
        expect(item).to.haveOwnProperty('productId');
        expect(item.productId).to.be.eql(productId);
        expect(item).to.haveOwnProperty('quantity');
        expect(item.quantity).to.be.a('number');
        itemQuantity = item.quantity;
        console.log(itemQuantity);
      });
    });
  });

  it('TC_00.12_Verify modifying information about an item in the cart', () => {
    cy.api({
      method: 'PATCH',
      url: `${Base_URL}/carts/${cartId}/items/${itemId}`,
      body: {
        quantity: randomQuantity,
      },
    }).then((response) => {
      expect(response.status).to.be.eql(204);
    });
  });

  it('TC_00.13_Verify cart items after modifying information about an item in the cart ', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/carts/${cartId}/items`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);

      newItem = response.body;

      newItem.forEach((newItem) => {
        expect(newItem).to.be.an('object');
        expect(newItem).to.haveOwnProperty('id');
        expect(newItem.id).to.be.eql(itemId);
        expect(newItem).to.haveOwnProperty('productId');
        expect(newItem.productId).to.be.eql(productId);
        expect(newItem).to.haveOwnProperty('quantity');
        expect(newItem.quantity).to.not.equal(itemQuantity);
      });
    });
  });

  it('TC_00.14_Verify replasing item in the cart', () => {
    cy.api({
      method: 'PUT',
      url: `${Base_URL}/carts/${cartId}/items/${itemId}`,
      body: {
        productId: 2177,
        quantity: 9,
      },
    }).then((response) => {
      expect(response.status).to.be.eql(204);
    });
  });

  it('TC_00.15_Verify cart items after replasing item in the cart', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/carts/${cartId}/items`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);

      newItem = response.body;

      newItem.forEach((newItem) => {
        expect(newItem).to.be.an('object');
        expect(newItem).to.haveOwnProperty('id');
        expect(newItem.id).to.be.eql(itemId);
        expect(newItem).to.haveOwnProperty('productId');
        expect(newItem.productId).to.be.eql(2177);
        expect(newItem).to.haveOwnProperty('quantity');
        expect(newItem.quantity).to.equal(9);
      });
    });
  });

  it.skip('TC_00.16_Verify cart items is deleted', () => {
    cy.api({
      method: 'DELETE',
      url: `${Base_URL}/carts/${cartId}/items/${itemId}`,
    }).then((response) => {
      expect(response.status).to.be.eql(204);
    });
  });

  it.skip('TC_00.17_Verify cart items after item was deleted', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/carts/${cartId}/items`,
    }).then((response) => {
      expect(response.status).to.be.eql(200);
      console.log(response.body.length);
      expect(0).to.be.eql(response.body.length);
    });
  });

  clientEmail.forEach((clientEmail) => {
    it(`TC_00.18_Verify Register a new API client Autorization using positive and negative clientEmail: ${clientEmail}`, () => {
      cy.api({
        method: 'POST',
        url: `${Base_URL}/api-clients`,
        headers: {},
        body: {
          clientName,
          clientEmail: clientEmail,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (clientEmail === randomClientEmail) {
          expect(response.status).to.be.eql(201);
          expect(response.body).to.be.an('object');
          expect(response.body).to.haveOwnProperty('accessToken');
          expect(response.body.accessToken).to.be.a('string');
          token = response.body.accessToken;
        } else {
          expect(response.status).to.equal(409);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.eql(
            'API client already registered. Try a different email.'
          );
        }
        console.log(token);
        console.log(randomClientEmail);
      });
    });
  });

  it('TC_00.19_Verify Create a new order', () => {
    cy.api({
      method: 'POST',
      url: `${Base_URL}/orders`,
      headers: {
        Authorization: token,
      },
      body: {
        cartId,
        customerName: clientName,
      },
    }).then((response) => {
      orderId = response.body.orderId;
      expect(response.status).to.be.eql(201);
      expect(response.body).to.be.an('object');
      expect(response.body).to.haveOwnProperty('created');
      expect(response.body.created).to.be.true;
      expect(response.body).to.haveOwnProperty('orderId');
      expect(response.body.orderId).to.be.eql(orderId);
      console.log(orderId);
    });
  });

  it('TC_00.20_Verify all orders', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/orders`,
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      //let actualOrderId = response.body[0].id;
      let actualOrderId = response.body.map((el) => el.id); //.toString();
      console.log(actualOrderId);
      expect(response.status).to.be.eql(200);
      expect(response.body).to.be.an('array');
      expect(actualOrderId).to.be.eql([orderId]);
    });
  });

  it('TC_00.20_Verify all orders', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/orders`,
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      //let actualOrderId = response.body[0].id;
      let actualOrderId = response.body.map((el) => el.id); //.toString();
      console.log(actualOrderId);

      expect(response.status).to.be.eql(200);
      expect(response.body).to.be.an('array');
      expect(actualOrderId).to.be.eql([orderId]);
    });
  });

  it('TC_00.21_Verify a single order', () => {
    cy.api({
      method: 'GET',
      url: `${Base_URL}/orders/${orderId}`,
      headers: {
        Authorization: token,
      },
      qs: {
        invoice: true,
      },
    }).then((response) => {
      let actualOrderId = response.body.id;
      console.log(actualOrderId);

      expect(response.status).to.be.eql(200);
      expect(response.body).to.be.an('object');
      expect(actualOrderId).to.be.eql(orderId);
    });
  });

  it('TC_00.22_Verify update an order', () => {
    cy.api({
      method: 'PATCH',
      url: `${Base_URL}/orders/${orderId}`,
      headers: {
        Authorization: token,
      },
      body: {
        customerName: 'Kate',
        comment: 'my order',
      },
    }).then((response) => {
      console.log(response.body);

      expect(response.status).to.be.eql(204);
      expect(response.body).to.be.undefined;
    });
  });
});
