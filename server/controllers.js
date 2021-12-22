const models = require('./models');

module.exports = {
  getReviews: (req, res) => {
    models.getReviewsFromDB(data => {
      res.json(data.rows);
    });
  },
  getReviewsMetaData: (req, res) => {

  },
  addReview: (req, res) => {

  },
  markReviewAsHelpful: (req, res) => {


  },
  markReviewAsReported: (req, res) => {

  }
};