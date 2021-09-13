//imports
const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv').config({ path: "./config/config.env" });
var url = require('url');

router.get('/', async (req, res) => {
    console.clear();
    try {
        console.log(getTime() + ' : Getting information from STEAM API...'.white.bold);
        const urlOrSteamID = req.query.urlOrSteamID;
        const appId = req.query.appId;

        if (urlOrSteamID == "" || urlOrSteamID == null || appId == "" || appId == null) {
            console.log(getTime() + ' : 400 : BAD REQUEST : The request did not contain steam steamId, URL or appId.'.red.bold);
            res.status(400).json({
                success: false,
                status: 'The request did not contain steam steamId, URL or appId.'
            });
        }
        else {
            console.log(getTime() + ' : Checking information...'.white.bold);
            if (checkIfURLisValid(urlOrSteamID)) {
                console.log(getTime() + ' : URL Detected, Converting URL into steamID...'.white.bold);

                var q = url.parse(urlOrSteamID, true);
                var arr = q.pathname.split('/');


                axios.get(process.env.CONVERT_STEAM_URL_TO_STEAM_ID,

                    { params: { key: process.env.STEAM_API_KEY, vanityurl: arr[2] } }

                )
                    .then(function (response) {
                        // handle success
                        console.log(getTime() + ' : URL was decoded and "steamid" was fetched, getting video game statistics...'.white.bold);


                        axios.get(process.env.STEAM_GET_GAME_STATS,

                            {
                                params: {
                                    key: process.env.STEAM_API_KEY,
                                    appid: appId,
                                    steamid: response.data.response.steamid
                                }
                            }

                        )
                            .then(function (response) {
                                // handle success
                                console.log(getTime() + ' : Data has been fetched, check response.'.green.bold);
                                res.status(200).json({
                                    success: true,
                                    dataTimeStamp: getTime(),
                                    data: response.data
                                });
                            })
                            .catch(function (error) {
                                // handle error
                                console.log(error);

                                console.log(getTime() + ' : 400 : BAD REQUEST : The STEAM API responded with an error, maybe the URL is incorrect, user profile is private or STEAM API is not responding at the moment.'.red.bold);
                                res.status(400).json({
                                    success: false,
                                    status: 'The STEAM API responded with an error, maybe the URL is incorrect, user profile is private or STEAM API is not responding at the moment.'
                                });
                            })

                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);

                        console.log(getTime() + ' : 400 : BAD REQUEST : The STEAM API responded with an error, maybe the URL is incorrect.'.red.bold);
                        res.status(400).json({
                            success: false,
                            status: 'The STEAM API responded with an error, maybe the URL is incorrect.'
                        });
                    });

            }
            else if (isNumeric(urlOrSteamID)) {
                console.log(getTime() + ' : Getting video game statistics from steamID...'.white.bold);


                axios.get(process.env.STEAM_GET_GAME_STATS,

                    {
                        params: {
                            key: process.env.STEAM_API_KEY,
                            appid: appId,
                            steamid: urlOrSteamID
                        }
                    }

                )
                    .then(function (response) {
                        // handle success
                        console.log(getTime() + ' : Data has been fetched, check response.'.green.bold);
                        res.status(200).json({
                            success: true,
                            dataTimeStamp: getTime(),
                            data: response.data
                        });
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);

                        console.log(getTime() + ' : 400 : BAD REQUEST : The STEAM API responded with an error, maybe the URL is incorrect, user profile is private or STEAM API is not responding at the moment.'.red.bold);
                        res.status(400).json({
                            success: false,
                            status: 'The STEAM API responded with an error, maybe the URL is incorrect, user profile is private or STEAM API is not responding at the moment.'
                        });
                    })
            }
            else {
                console.log(getTime() + ' : 400 : BAD REQUEST : The request contained invalid steam steamId, URL or appId.'.red.bold);
                res.status(400).json({
                    success: false,
                    status: 'The request contained invalid steam steamId, URL or appId.'
                });
            }


        }
    }
    catch (error) {
        console.log(error);
        console.log(getTime() + " : Routes were not launched successfully.".red.bold);
    }
});

router.get('/searchSteamDatabase', async (req, res) => {
    console.clear();
    try {
        console.log(getTime() + ' : Getting information from STEAM API...'.white.bold);
        var data = null;


        const search = req.query.search;

        axios.get(process.env.STEAM_VIDEO_GAME_DATABASE)
            .then(function (response) {
                // handle success
                console.log(getTime() + ' : Data has been fetched, check response.'.green.bold);

                data = response.data.applist;


                if (search == "" || search == null) {
                    res.status(200).json({
                        success: true,
                        dataTimeStamp: getTime(),
                        data: data
                    });
                }
                else {
                    var searchArr = [];
                    const gg = response.data.applist.apps;
                    for (var i = 0; i < gg.length; i++) {
                        if (isSubstring(search.toLowerCase(), gg[i].name.toLowerCase()) != -1) {
                            searchArr.push(gg[i]);
                        }
                    }
                    res.status(200).json({
                        success: true,
                        dataTimeStamp: getTime(),
                        data: searchArr
                    });
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                console.log(getTime() + ' : 400 : BAD REQUEST : The STEAM API responded with an error, maybe the URL is incorrect, user profile is private or STEAM API is not responding at the moment.'.red.bold);
                res.status(400).json({
                    success: false,
                    status: 'The STEAM API responded with an error, maybe the URL is incorrect, user profile is private or STEAM API is not responding at the moment.'
                });
            })


    }
    catch (error) {
        console.log(error);
        console.log(getTime() + " : Routes were not launched successfully.".red.bold);
    }
});


module.exports = router;



function checkIfURLisValid(str) {
    var pattern = new RegExp("((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)"); // fragment locator
    return !!pattern.test(str);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function getTime() {
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (
        date_ob.getMonth() + 1
    )).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    // current seconds
    let mseconds = date_ob.getMilliseconds();
    var out = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ":" + mseconds;
    return out;
}


function isSubstring(s1, s2) {
    var M = s1.length;
    var N = s2.length;

    /* A loop to slide pat[] one by one */
    for (var i = 0; i <= N - M; i++) {
        var j;

        /* For current index i, check for
 pattern match */
        for (j = 0; j < M; j++)
            if (s2[i + j] != s1[j])
                break;

        if (j == M)
            return i;
    }

    return -1;
}


//






