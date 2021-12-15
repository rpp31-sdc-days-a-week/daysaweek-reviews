const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const client = require('./index');

const reviewsCSVFilePath = path.join(__dirname, '../datasets/reviews.csv');
const reviewsPhotosCSVFilePath = path.join(__dirname, '../datasets/reviews_photos.csv');
const characteristicsCSVFilePath = path.join(__dirname, '../datasets/characteristics.csv');
const characteristic_reviewsCSVFilePath = path.join(__dirname, '../datasets/characteristic_reviews.csv');

const filesToParse = [
  reviewsCSVFilePath,
  reviewsPhotosCSVFilePath,
  characteristicsCSVFilePath,
  characteristic_reviewsCSVFilePath
];

const parseCSVFiles = async (filePath) => {
  try {
    if (filePath === reviewsCSVFilePath) {
      let counter = 0;

      let csvStream = csv.parseFile(reviewsCSVFilePath, { headers: true })
        .on('data', row => {
          if (counter < 5) {
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

            // let query = {
            //   text: `INSERT INTO reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            //   values: [id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness]
            // };

            // client
            //   .query(query)
            //   .then(res => console.log(res.rows[0]))
            //   .catch(e => console.error(e.stack))

            const reviews = {
              id,
              product_id,
              rating,
              date,
              summary,
              body,
              recommend,
              reported,
              reviewer_name,
              reviewer_email,
              response,
              helpfulness
            };

            console.log(reviews);

            counter += 1;
          }
        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`))
        .on('error', error => console.error(error));
    }

    if (filePath === reviewsPhotosCSVFilePath) {
      let counter = 0;

      let csvStream = csv.parseFile(reviewsPhotosCSVFilePath, { headers: true })
        .on('data', row => {
          if (counter < 5) {
            let id = parseInt(row.id);
            let review_id = parseInt(row.review_id);
            let url = row.url;

            const photo = {
              id,
              review_id,
              url
            };

            console.log(photo);

            counter += 1;
           }
        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`))
        .on('error', error => console.error(error));
    }

    if (filePath === characteristicsCSVFilePath) {
      let counter = 0;
      let csvStream = csv.parseFile(characteristicsCSVFilePath, { headers: true })
        .on('data', row => {
          if (counter < 5) {
            let id = parseInt(row.id);
            let product_id = parseInt(row.product_id);
            let name = row.name;

            const char = {
              id,
              product_id,
              name
            };

            console.log(char);

            counter += 1;
          }
        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`))
        .on('error', error => console.error(error));
    }

    if (filePath === characteristic_reviewsCSVFilePath) {
      let counter = 0;
      let csvStream = csv.parseFile(characteristic_reviewsCSVFilePath, { headers: true })
        .on('data', row => {
          if (counter < 5) {
            let id = parseInt(row.id);
            let characteristic_id = parseInt(row.characteristic_id);
            let review_id = parseInt(row.review_id);
            let value = row.value;

            let charRev = {
              id,
              characteristic_id,
              review_id,
              value
            };

            console.log(charRev);
            counter += 1;
          }
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


