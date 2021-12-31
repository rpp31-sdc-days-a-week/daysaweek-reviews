const pool = require('../database-psql/index');

const getReviewsFromDB = async (page, count, sort, productID) => {
  if (sort === 'newest') {
    sort = 'ORDER BY r.date DESC'
  }

  if (sort === 'helpful') {
    sort = 'ORDER BY r.helpfulness DESC'
  }

  if (sort === 'newest') {
    sort = 'ORDER BY r.helpfulness DESC, r.date DESC'
  }

  const offset = (count * page) - count;

  const query = `
    SELECT r.id AS review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, (
      SELECT coalesce(json_agg(json_build_object('id', photo.id, 'url', photo.url)), '[]'::json)
      FROM (
        SELECT p.id, p.url
        FROM photos AS p
        JOIN reviews
        ON reviews.id = p.review_id
        WHERE p.review_id = r.id
      ) AS photo
    ) AS photos
    FROM reviews AS r
    WHERE r.product_id = ${productID} AND r.reported = false
    ${sort}
    LIMIT ${count}
    OFFSET ${offset};`;

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
};

const getReviewsMetaDataFromDB = async (productID) => {
  const query = `
  select rMain.product_id,
    (
    select jsonb_agg(outerC) from
      (
      SELECT json_object_agg(r2.rating,
        (
        SELECT count(r1.rating)
        FROM reviews r1
        WHERE r1.product_id = rMain.product_id AND r1.rating = r2.rating
        )
      ) AS counts
    FROM reviews r2
    WHERE r2.product_id = rMain.product_id
    GROUP BY r2.rating) as outerC) as ratings,
    (
    select jsonb_agg(outerRecommendCounts) from
      (
      SELECT json_object_agg(r4.recommend,
        (
        SELECT count(r3.recommend)
        FROM reviews r3
        WHERE r3.product_id = rMain.product_id AND r3.recommend = r4.recommend
        )
      ) AS recommendCounts
    FROM reviews r4
    WHERE r4.product_id = rMain.product_id
    GROUP BY r4.recommend) as outerRecommendCounts
    ) as recommended,
    (
    select array_to_json(array_agg(characteristicGroup)) from
      (
      select c.name, c.id, avg(cr.value) as value
      from "characteristics" c
      inner join characteristic_reviews cr
      on c.id = cr.characteristic_id
      where c.product_id = rMain.product_id
      group by c.id
      ) characteristicGroup
    ) as characteristics
  from reviews rMain
  where rMain.product_id = ${productID}
  group by rMain.product_id
  ;`;

  const metadataTransformer = (data) => {
    let transformedRatings = {},
      transformedRecommended = {},
      transformedCharacteristics = {};
    data = data.rows[0];

    data.ratings.forEach((row) => {
      transformedRatings = { ...transformedRatings, ...row.counts };
    });
    data.ratings = transformedRatings;

    data.recommended.forEach((row) => {
      transformedRecommended = { ...transformedRecommended, ...row.recommendcounts };
    });
    data.recommended = transformedRecommended;

    data.characteristics.forEach((row) => {
      transformedCharacteristics = { ...transformedCharacteristics, [row.name]: { id: row.id, value: row.value } };
    });
    data.characteristics = transformedCharacteristics;

    return data;
  };

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
};

const addPhotosToDB = async ({ photos, reviewId }) => {
  const query = `INSERT INTO photos (url, review_id) SELECT url, review_id FROM UNNEST $1::text[], $2::int[]) AS t (url, review_id)`;

  const client = await pool.connect();
  const data = await client.query(query, [photos, Array(photos.length).fill(reviewId)]);
  client.release();
  return data;
};

const addCharacteristicReviewsToDB = async ({ characteristics, reviewID }) => {
  const query = `INSERT INTO characteristics_reviews (review_id, characteristics_id, value)
  SELECT review_id, characteristics_id, value FROM UNNEST ($1::int[], $2::int[], $3::int[]) AS t (review_id, characteristics_id, value)`;

  const client = await pool.connect();
  const data = await client.query(query, [ Array(Object.keys(characteristics).length).fill(reviewId), Object.keys(characteristics), Object.values(characteristics),
  ]);
  client.release();
  return data;
}

const addReviewToDB = async ({ product_id, rating, summary, body, recommend, name, email }) => {
  const query = `INSERT INTO reviews
      (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, helpfulness)
      VALUES
      (${product_id}, ${rating}, current_timestamp, '${summary}', '${body}', ${recommend}, '${name}', '${email}', 0)`;

  const client = await pool.connect();
  const data = await client.query(query);
  addPhotosToDB();
  addCharacteristicReviewsToDB();
  client.release();
  return data;
};

const markReviewAsHelpfulOnDB = async (reviewID) => {
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${reviewID}`;

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
};

const markReviewAsReportedOnDB = async () => {
  const query = `UPDATE reviews SET reported = ${true} WHERE id = ${reviewID}`;

  const client = await pool.connect();
  const data = await client.query(query);
  client.release();
  return data;
};

module.exports = {
  getReviewsFromDB,
  getReviewsMetaDataFromDB,
  addReviewToDB,
  markReviewAsHelpfulOnDB,
  markReviewAsReportedOnDB
}