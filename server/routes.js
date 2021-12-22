const router = require('express').Router();
const controllers = require('./controllers');

router.get('/reviews/:product_id/list', controllers.getReviews);
router.get('/reviews/:product_id/meta', controllers.getReviewsMetaData);
router.post('/reviews/:product_id', controllers.postReview);
router.put('/reviews/helpful/:review_id', controllers.markReviewAsHelpful);
router.put('/reviews/report/:review_id', controllers.markReviewAsReported);

module.exports = router;