const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const ffmpeg = require('fluent-ffmpeg');
const mkdirp = require('mkdirp');
const fs = require('fs');

const searchYoutube = async query => ytsr(query, { limit: 1 });

const getYoutubePlaylistOrChannel = async id => ytpl(id);

const getTracklistFromYoutube = async () => {
    const trackList = [
        '01. DRS - Overdose',
        '02. Madnezz & DRS - Hardcore Geweld',
        '03. DRS & Chaotic Hostility - The Real Is On The Rise',
        '04. DRS & MBK - President',
        '05. DRS & Spitnoise - Can You See The Dark',
        '06. Thunderball - Channel One (DRS Remix)',
        '07. DRS & Death Shock - Bucketlist',
        '08. Turbulence - Six Million Ways To Die (Cryogenic & DRS We Dont Give A Fuck Refix)',
        '09. DRS - Get Fucked Up',
        '10. DRS - Fight Or Fall',
        '11. DRS - Click Clack',
        '12. DRS - Never Shall We Die',
        '13. DRS - Shut The Fuck Up',
        '14. DRS - Chamber Of Hell',
        '15. DRS & MBK ft. eDUB - Mothafokaz',
        '16. DRS - I Am The Danger',
        '17. DRS - Fuck The Dresscode',
        '18. DRS ft. MC Rampaged - Let The Ground Shiver',
        '19. The Demon Dwarf & DRS - The Westcoast Is Back',
        '20. DRS - Live Life Hard',
        '21. Cryogenic - Victimized (DRS Remix)',
        '22. DRS - Never Surrender',
        '23. F.Noize - Lord Of The Underground (DRS Remix)',
        '24. DRS - Click Clack 2.0',
        '25. DRS & NSD - Ripped Off',
        '26. DRS & Angernoizer - Domination',
    ];

    const results = [];

    if (trackList.length >= 100) return console.log('Song limit exceeded (100)');

    for (let i = 0; i < trackList.length; i += 1) {
        results.push(searchYoutube(trackList[i]));
    }

    const youtubeSearch = await Promise.all(results);

    for (const result of youtubeSearch) {
        const { link, author } = result.items[0];
        const { name } = author;

        if (link && name) {
            mkdirp(`./library/${name}`, e => {
                if (e) console.log(e);

                ytdl.getBasicInfo(link, (er, info) => {
                    if (er) console.log(er);

                    const stream = ytdl(link, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                    });

                    const { title, lengthSeconds } = info.player_response.videoDetails;

                    fs.access(`./library/${name}/${title}.mp3`, fs.constants.F_OK, response => {
                        if (!response) return console.log(`${title} already exists - Abort \n`);

                        if (lengthSeconds < 120 || lengthSeconds > 384) {
                            const failedStream = fs.createWriteStream(`./library/failed.txt`, { flags: 'a' });

                            failedStream.write(`${result.query}\n`);
                            failedStream.end();

                            return console.log(`${result.query} is likely a preview or in a mix - Abort \n`);
                        }

                        ffmpeg(stream)
                            .audioBitrate(320)
                            .save(`./library/${name}/${title}.mp3`)
                            .on('error', err => {
                                console.log(`An error occurred: ${err.message} \n`);
                            })
                            .on('start', () => {
                                console.log(`${title} - Start \n`);
                            })
                            .on('end', () => {
                                console.log(`${title} - Finished \n`);
                            });
                    });
                });
            });
        } else {
            console.log('No id was found');
        }
    }
};

module.exports = {
    searchYoutube,
    getYoutubePlaylistOrChannel,
    getTracklistFromYoutube,
};
