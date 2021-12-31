const router = require('express').Router();
const controllers = require('./controllers');

router.get('/api/reviews/:product_id', controllers.getReviews);
router.get('/api/reviews/:product_id/meta', controllers.getReviewsMetaData);
router.post('/api/reviews', controllers.addReview);
router.put('/api/reviews/:review_id/helpful', controllers.markReviewAsHelpful);
// router.put('/reviews/report/:review_id', controllers.markReviewAsReported);

module.exports = router;