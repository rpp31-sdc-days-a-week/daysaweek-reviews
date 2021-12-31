const models = require('./models');

module.exports = {
  getReviews: async (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const sort = req.query.sort || 'helpful';
    const productID = req.params.product_id;

    try {
      let data = await models.getReviewsFromDB(page, count, sort, productID);
      res.status(200).send(data.rows);
    } catch(err) {
      console.log(err);
      res.status(404).send();
    }
  },
  getReviewsMetaData: async (req, res) => {
    const productID = req.params.product_id;

    try {
      let data = await models.getReviewsMetaDataFromDB(productID);
      res.status(200).send(data);
    } catch(err) {
      console.log(err);
      res.status(404).send();
    }
  },
  addReview: async (req, res) => {
    const bodyParams = { ...req.body };

    try {
      let data = await models.addReviewToDB(bodyParams);
      res.status(201).send(data);
    } catch(err) {
      console.log(err);
      res.status(201).send();
    }
  },
  markReviewAsHelpful: async (req, res) => {
    let reviewID = req.params.review_id;

    try {
      let data = await models.markReviewAsHelpful(reviewID);
      res.status(204).send();
    } catch(err) {
      console.log(err);
      res.status(404).send();
    }

  },
  markReviewAsReported: async (req, res) => {
    let reviewID = req.params.review_id;

    try {
      let data = await models.markReviewAsHelpful(reviewID);
      res.status(204).send();
    } catch(err) {
      console.log(err);
      res.status(404).send();
    }
  }
};