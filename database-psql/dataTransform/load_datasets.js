const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const pool = require('./index');

const reviewsCSVFilePath = path.join(__dirname, '../datasets/reviews2.csv');
const reviewsPhotosCSVFilePath = path.join(__dirname, '../datasets/reviews_photos.csv');
const characteristicsCSVFilePath = path.join(__dirname, '../datasets/characteristics.csv');
const characteristic_reviewsCSVFilePath = path.join(__dirname, '../datasets/characteristic_reviews.csv');

console.log(reviewsCSVFilePath);

const filesToParse = [
  reviewsCSVFilePath
];

const parseCSVFiles = (filePath) => {
  try {
    if (filePath === reviewsCSVFilePath) {
      let csvStream = csv.parseFile(reviewsCSVFilePath, { headers: true })
        .on('data', row => {
          csvStream.pause();
          // transform data to match database field types
          let id = parseInt(row.id);
          let product_id = parseInt(row.product_id);
          let rating = parseInt(row.rating);
          let date = !!row.date && new Date(parseInt(row.date)) != 'Invalid Date' ? new Date(parseInt(row.date)).toISOString() : null;
          let summary = row.summary;
          let body = row.body;
          let recommend = row.recommend === 'true';
          let reported = row.reported === 'true';
          let reviewer_name = row.reviewer_name;
          let reviewer_email = row.reviewer_email;
          let response = !!row.response && row.response !== 'null' && row.response !== undefined ? row.repsonse : null;
          let helpfulness = parseInt(row.helpfulness);

          // insert data into reviews table
          let query = {
            text: `INSERT INTO reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            values: [id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness]
          };

          pool
            .query(query)
            .then(res => console.log(res.rows))
            .catch(e => console.error(e.stack))

            csvStream.resume();
        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`))
        .on('error', error => console.error(error));
    }

    if (filePath === reviewsPhotosCSVFilePath) {
      let csvStream = csv.parseFile(reviewsPhotosCSVFilePath, { headers: true })
        .on('data', row => {
          csvStream.pause();
          // transform data to match database field types
          let id = parseInt(row.id);
          let review_id = parseInt(row.review_id);
          let url = row.url;

          // insert data into photos table
          let query = {
            text: 'INSERT INTO photos(id, review_id, url) VALUES($1, $2, $3)',
            values: [id, review_id, url]
          };

          pool
          .query(query)
          .then(res => console.log(res.rows))
          .catch(e => console.error(e.stack))

          csvStream.resume();
        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`))
        .on('error', error => console.error(error));
    }

    if (filePath === characteristicsCSVFilePath) {
      let csvStream = csv.parseFile(characteristicsCSVFilePath, { headers: true })
        .on('data', row => {
          csvStream.pause();
          // transform data to match database field types
          let id = parseInt(row.id);
          let product_id = parseInt(row.product_id);
          let name = row.name;

          // insert data into characteristics table
          let query = {
            text: 'INSERT INTO characteristics(id, product_id, name) VALUES($1, $2, $3)',
            values: [id, product_id, name]
          };

          pool
          .query(query)
          .then(res => console.log(res.rows))
          .catch(e => console.error(e.stack))

          csvStream.resume();
        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`))
        .on('error', error => console.error(error));
    }

    if (filePath === characteristic_reviewsCSVFilePath) {
      let csvStream = csv.parseFile(characteristic_reviewsCSVFilePath, { headers: true })
        .on('data', row => {
          csvStream.pause();
          // transform data to match database field types
          let id = parseInt(row.id);
          let characteristic_id = parseInt(row.characteristic_id);
          let review_id = parseInt(row.review_id);
          let value = row.value;

          // insert data into characteristic_reviews table
          let query = {
            text: 'INSERT INTO characteristic_reviews(id, characteristic_id, review_id, value) VALUES($1, $2, $3, $4)',
            values: [id, characteristic_id, review_id, value]
          };

          pool
          .query(query)
          .then(res => console.log(res.rows))
          .catch(e => console.error(e.stack))

          csvStream.resume();
        })
    }
  }
  catch (e) {
    console.log(e)
  }
}

const runParseProdecure = async (filesToParse) => {
  for (file of filesToParse) {
    await parseCSVFiles(file);
  }
};

runParseProdecure(filesToParse);


