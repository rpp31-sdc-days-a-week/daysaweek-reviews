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
  getReviewsMetaData: (req, res) => {

  },
  addReview: async (req, res) => {
    const params = { ...req.body, productID: req.params.product_id };

    try {
      let data = await models.addReviewToDB(params);
      res.status(201).send(data);
    } catch(err) {
      console.log(err);
      res.status(201).send();
    }
  },
  markReviewAsHelpful: (req, res) => {


  },
  markReviewAsReported: (req, res) => {

  }
};