const pool = require('../database-psql/index');
const formatData = require('../database-psql/dataTransform/transform_data');

const getReviewsFromDB = async (page, count, sort, productID) => {
  if (sort === 'newest') {
    sort = 'r.date DESC'
  }

  if (sort === 'helpful') {
    sort = 'r.helpfulness DESC'
  }

  if (sort === 'relevant') {
    sort = 'r.helpfulness DESC, r.date DESC'
  }

  const offset = (count * page) - count;

  const query = `
    SELECT r.id AS review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, (
      SELECT coalesce(json_agg(json_build_object('id', photo.id, 'url', photo.url)), '[]'::JSON)
      FROM (
        SELECT p.id, p.url
        FROM photos AS p
        JOIN reviews ON reviews.id = p.review_id
        WHERE p.review_id = r.id
      ) AS photo
    ) AS photos
    FROM reviews AS r
    WHERE r.product_id = ${productID} AND r.reported = false
    ORDER BY ${sort}
    LIMIT ${count}
    OFFSET ${offset};`;

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
};

const getReviewsMetaDataFromDB = async (productID) => {

  const query = `
    SELECT r.product_id, (
      SELECT jsonb_agg(json_build_object(r3.rating, r3.count::TEXT))
      FROM (
        SELECT r2.rating, COUNT(r2.rating)
        FROM reviews AS r2
        WHERE r2.product_id = r.product_id
        GROUP BY r2.rating
      ) AS r3
    ) AS ratings, (
      SELECT jsonb_agg(json_build_object(r5.recommend, r5.count::TEXT))
      FROM (
        SELECT r4.recommend, COUNT(r4.recommend)
        FROM reviews AS r4
        WHERE r4.product_id = r.product_id
        GROUP BY r4.recommend
      ) AS r5
    ) AS recommended, (
      SELECT jsonb_agg(json_build_object('name', cg.name, 'id', cg.id ,'value', cg.value::TEXT))
      FROM (
        SELECT c.name, c.id, AVG(cr.value) AS value
        FROM characteristics AS c
        JOIN characteristic_reviews AS cr ON c.id = cr.characteristic_id
        WHERE c.product_id = r.product_id
        GROUP BY c.id
      ) AS cg
    ) AS characteristics
    FROM reviews AS r
    WHERE r.product_id = ${productID}
    GROUP BY r.product_id;`

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();

  return data.rows.length ? formatData(data) : data;
};

const addPhotosToDB = async ({ photos, reviewID }) => {
  const reviewIDs = [];
  for (let i = 0; i < photos.length; i++) {
    reviewIDs.push(reviewID);
  };

  const query = {
    text: `
      INSERT INTO photos (url, review_id)
      SELECT url, review_id
      FROM UNNEST ($1::VARCHAR[], $2::INTEGER[]) AS p (url, review_id);`,
    values: [photos, reviewIDs]
  }

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
};

const addCharacteristicReviewsToDB = async ({ characteristics, reviewID }) => {
  const reviewIDs = [];
  for (let i = 0; i < Object.keys(characteristics).length; i++) {
    reviewIDs.push(reviewID);
  };
  const char = Object.keys(characteristics);
  const values = Object.values(characteristics);

  const query = {
    text: `
    INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
    SELECT review_id, characteristic_id, value
    FROM UNNEST ($1::INTEGER[], $2::INTEGER[], $3::INTEGER[]) AS c (review_id, characteristic_id, value)`,
    values: [reviewIDs, char, values]
  };

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
}

const addReviewToDB = async ({ product_id, rating, summary, body, recommend, name, email, characteristics }) => {
  const query = `
      INSERT INTO reviews
      (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, helpfulness, reported)
      VALUES
      (${product_id}, ${rating}, CURRENT_TIMESTAMP, '${summary}', '${body}', ${recommend}, '${name}', '${email}', 0, false)
      RETURNING id;`;

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
};

const markReviewAsHelpfulOnDB = async (reviewID) => {
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${reviewID} RETURNING product_id`;

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
};

const markReviewAsReportedOnDB = async (reviewID) => {
  const query = `UPDATE reviews SET reported = ${true} WHERE id = ${reviewID} RETURNING product_id`;

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
};

module.exports = {
  getReviewsFromDB,
  getReviewsMetaDataFromDB,
  addPhotosToDB,
  addCharacteristicReviewsToDB,
  addReviewToDB,
  markReviewAsHelpfulOnDB,
  markReviewAsReportedOnDB
}