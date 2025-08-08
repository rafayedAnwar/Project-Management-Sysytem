const express = require('express');
const router = express.Router();
const {
    testAuth,
    submitStaffReview,
    submitManagerReview,
    getReviewsGiven,
    getReviewsReceived
} = require('../controllers/reviewController');

// Test authentication endpoint
router.get('/test-auth', testAuth);

// Submit reviews
router.post('/staff', submitStaffReview);
router.post('/manager', submitManagerReview);

// Get reviews
router.get('/given', getReviewsGiven);
router.get('/received', getReviewsReceived);

module.exports = router;