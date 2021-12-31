const nock = require('nock');

describe('Persistant Reviews API Server', () => {

  it('Server responds to GET requests for api/reviews/:product_id with a 200 status code', () => {
    const product_id = 1;
    const scope = nock('http://localhost:3000')
      .get(`/api/reviews/${product_id}`)
      .query({ count: 2, sort: 'helpful'})
      .reply(200)

    expect(1).toBe(2);

  });

});