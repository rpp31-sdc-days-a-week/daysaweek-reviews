const models = require('../server/models.js');

describe('DB Models are functioning', () => {

  it('Should get reviews from DB', async () => {

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
    const res = await models.getReviewsFromDB(1, 2, 'helpful', product_id);
    expect(res.rows).toEqual(mockResponse);

  }, 70000);

   it('Should get reviews from DB', async () => {

    const product_id = 1;

    const res = await models.getReviewsMetaDataFromDB(product_id);
    expect(product_id).toEqual(product_id);

  }, 70000);

  it('Should add a review to the DB', async () => {
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
    const res = await models.addReviewToDB(mockData);
    expect(mockData).toEqual(mockData);
  })
});