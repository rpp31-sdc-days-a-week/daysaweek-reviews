const client = require('../database-psql/index');

module.exports = {
  getReviewsFromDB: (callback) => {
    let query = 'SELECT * FROM reviews WHERE product_id = 1';

    client.query(query, (err, res) => {
      if (err) {
        console.log(err.stack);
        return;
      }

      callback(res);
    })
  },
  getReviewsMetaDataFromDB: () => {

  },
  addReviewToDB: () => {

  },
  markReviewAsHelpfulOnDB: () => {

  },
  markReviewAsReportedOnDB: () => {

  }
};