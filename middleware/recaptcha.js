const axios = require('axios');
const dotenv = require("dotenv").config({ path: "./config/config.env" });
var unirest = require('unirest');

//jklhjkl


module.exports = async function (req, res, next) {
    console.clear();
    try {
        const reCaptchaToken = req.header('reCaptchaToken');
        if (reCaptchaToken == null || reCaptchaToken == "") {
            console.log(getTime() + ' : 400 : BAD REQUEST : reCaptcha Token was not supplied as authorization header.'.red.bold);
            res.status(400).json({
                status: 'reCaptcha Token was not supplied as authorization header.',
                success: false
            })
                .end();

        }
        else {
            const url = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.RE_CAPTCHA_SECRET + "&response=" + reCaptchaToken;

            return new Promise((resolve, reject) => {
                unirest.post(url).end(function (response) {
                    if (response.error) {
                        req.recaptcha = false;
                        console.log(getTime() + " : reCaptcha verification failed. User interaction was suspicious.".bold.red);
                        return res.status(400).json({ status: '400 : BAD REQUEST : reCaptcha verification failed. User interaction was suspicious.', success: false }).end();
                    }
                    req.recaptcha = true;
                    console.log(getTime() + " : reCaptcha verification successful".bold.green);
                    return next();

                });
            })
        }
    }
    catch (error) {
        console.log(error);
        console.log('500 : SERVER ERROR : Something went wrong with recaptcha middleware'.red.bold);
        res.status(500).json({ status: 'Something went wrong with recaptcha middleware', success: false });
    }
};


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