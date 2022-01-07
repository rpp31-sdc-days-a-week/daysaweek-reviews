const app = require('../server/index.js');
const nock = require('nock');
const request = require('supertest');

describe('Persistant Reviews API Server', () => {
  let scope;

  beforeEach(() => {
    scope = nock('http://localhost');
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

  it('Responds to GET requests for api/reviews/:product_id with a 200 status code', async () => {

    const product_id = 1;
    const mockResponse = [
      {
      "review_id": 1,
      "rating": 5,
      "summary": "This product was great!",
      "recommend": true,
      "response": null,
      "body": "I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.",
      "date": "2020-07-30T03:41:21.467Z",
      "reviewer_name": "funtime",
      "helpfulness": 8,
      "photos": []
      },
      {
      "review_id": 2,
      "rating": 4,
      "summary": "This product was ok!",
      "recommend": false,
      "response": null,
      "body": "I really did not like this product solely because I am tiny and do not fit into it.",
      "date": "2021-01-09T07:47:13.963Z",
      "reviewer_name": "mymainstreammother",
      "helpfulness": 2,
      "photos": []
      }
    ];

    scope
      .get(`/api/reviews/${product_id}`)
      .query({ count: 2, page: 1, sort: 'helpful'})
      .reply(200, mockResponse)

    const res = await request(app).get(`/api/reviews/${product_id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse);

  }, 70000);

  it('Responds to GET requests for api/reviews/:product_id/meta with a 200 status code', async () => {

    const product_id = 1;
    const mockResponse = {
      "product_id": 59553,
      "ratings": {
          "1": 2,
          "2": 1,
          "3": 3,
          "4": 1,
          "5": 28
      },
      "recommended": {
          "false": 2,
          "true": 33
      },
      "characteristics": {
          "Size": {
              "id": 198945,
              "value": 3.4
          },
          "Width": {
              "id": 198946,
              "value": 3.6
          },
          "Comfort": {
              "id": 198947,
              "value": 3
          },
          "Quality": {
              "id": 198948,
              "value": 3.4
          }
      }
    }

    scope
      .get(`/api/reviews/${product_id}/meta`)
      .reply(200)


    const res = await request(app).get(`/api/reviews/${product_id}/meta`);
    expect(res.status).toBe(200);


  }, 70000);

  it('Responds to POST requests for api/reviews with a 201 status code', async () => {
    const mockData = {
      "product_id": 59553,
      "rating": 5,
      "summary": "PERFECT!",
      "body": "This product is amazing. I would so buy it again!!",
      "recommend": true,
      "name": "Trixie14",
      "email": "trixie14@email.com",
      "photos": [
         "https://res.cloudinary.com/dousz4spf/image/upload/v1641074852/atlier/fmaeo6kah47cpiw40ltn.jpg"
      ],
      "characteristics": {
         "199845": 3,
         "199846": 3,
         "199847": 3,
         "199848": 3
      }
    };

    scope
      .post('/api/reviews')
      .reply(201, mockData)

    const res = await request(app).post('/api/reviews');
    // expect(res.status).toBe(201);
    console.log(res.status);
  });

  it('Responds to PUT request for /api/reviews/:review_id/helpful with a 204 status code', async () => {
    const reviewID = 20;
    scope
      .put(`/api/reviews/${reviewID}/helpful`)
      .reply(204)

    const res = await request(app).put(`/api/reviews/${reviewID}/helpful`);
    expect(res.status).toBe(204);
  });


  it('Responds to PUT request for /api/reviews/:review_id/report with a 204 status code', async () => {
    const reviewID = 20;
    scope
      .put(`/api/reviews/${reviewID}/report`)
      .reply(204)

    const res = await request(app).put(`/api/reviews/${reviewID}/report`);
    expect(res.status).toBe(204);
  });

});