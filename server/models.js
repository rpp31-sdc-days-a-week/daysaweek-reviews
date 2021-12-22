const pool = require('../database-psql/index');

module.exports = {
  getReviewsFromDB: async (page, count, sort, productID) => {
    const query = ``;

    const client = await pool.connect();
    const data = await client.query(query);
    client.release();
    return data;
  },
  getReviewsMetaDataFromDB: () => {
    const query = ``;

  },
  addReviewToDB: (params) => {
    const query = ``;
  },
  markReviewAsHelpfulOnDB: () => {
    const query = ``;
  },
  markReviewAsReportedOnDB: () => {
    const query = ``;
  }
};