const models = require('./models');
const cluster = require('cluster');
const { createClient } = require('redis');

const redisClient = createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect();

module.exports = {
  getReviews: async (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const sort = req.query.sort || 'helpful';
    const productID = req.params.product_id;

    try {
      let cachedData = await redisClient.get(productID);

      if (cachedData) {
        return res.status(200).send(JSON.parse(cachedData).rows);
      }

      let data = await models.getReviewsFromDB(page, count, sort, productID);

      await redisClient.set(productID, JSON.stringify(data));

      res.status(200).send(data.rows);

    } catch(err) {
      console.log(err);
      res.status(404).send();
    }
  },
  getReviewsMetaData: async (req, res) => {
    const productID = req.params.product_id;
    const id = `meta${productID}`;

    try {
      let cachedData = await redisClient.get(id);
      if (cachedData) {
        return res.status(200).send(JSON.parse(cachedData));
      }

      let data = await models.getReviewsMetaDataFromDB(productID);

      await redisClient.set(id, JSON.stringify(data));

      res.status(200).send(data);

    } catch(err) {
      console.log(err);
      res.status(404).send();
    }
  },
  addReview: async (req, res) => {
    let params = req.body;

    try {
      let data = await models.addReviewToDB(params);
      let reviewID = data.rows[0].id;
      let photoData = await models.addPhotosToDB({ photos: params.photos, reviewID });
      let characteristicsData = await models.addCharacteristicReviewsToDB({ characteristics: params.characteristics, reviewID });

      redisClient.del(params.product_id.toString());

      res.status(201).send(data);
    } catch(err) {
      console.log(err);
      res.status(404).send();
    }
  },
  markReviewAsHelpful: async (req, res) => {
    let reviewID = req.params.review_id;

    try {
      let data = await models.markReviewAsHelpfulOnDB(reviewID);

      redisClient.del(data.rows[0].product_id.toString());

      res.status(204).send();
    } catch(err) {
      console.log(err);
      res.status(404).send();
    }

  },
  markReviewAsReported: async (req, res) => {
    let reviewID = req.params.review_id;

    try {
      let data = await models.markReviewAsReportedOnDB(reviewID);

      redisClient.del(data.rows[0].product_id.toString());

      res.status(204).send();
    } catch(err) {
      console.log(err);
      res.status(404).send();
    }
  }
};