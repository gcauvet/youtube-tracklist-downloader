const expressJwt = require('express-jwt');
const config = require('config');
const youtubeService = require('../youtube/youtube.service');

// eslint-disable-next-line consistent-return
const isRevoked = async (req, payload, done) => {
    const Youtube = await youtubeService.getYoutubeById(payload.sub);

    if (!Youtube) return done(null, true);

    done();
};

function jwt() {
    const { secret } = config;

    return expressJwt({ secret, isRevoked }).unless({
        path: [{ url: /youtube/ }, { url: '/' }],
    });
}

module.exports = jwt;
