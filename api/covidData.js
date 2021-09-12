const cacheUtil = require('../utils/cache');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        data: cacheUtil.getCovidDatafromCache(),
    });
});

module.exports = router;