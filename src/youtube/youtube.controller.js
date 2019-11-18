const express = require('express');

const router = express.Router();
const youtubeService = require('./youtube.service');

module.exports = router;

const getTracklistFromYoutube = (req, res, next) => {
    youtubeService
        .getTracklistFromYoutube(req.body)
        .then(() => res.json())
        .catch(err => next(err));
};

router.post('/getTracklistFromYoutube/', getTracklistFromYoutube);
