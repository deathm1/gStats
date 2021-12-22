//imports
const express = require("express");
const Logger = require("../../Logger");
const axios = require("axios");
const ini = require("ini");
const fs = require("fs");
const config = ini.parse(fs.readFileSync("./serverConfig/config.ini", "utf-8"));

module.exports = async function (req, res, next) {
  try {
    const appId = req.query.appId;
    const queryId = req.queryId;
    Logger.info(`Getting Steam App ${appId} information, for user ${queryId}`);
    axios
      .get(config.STEAM.GET_USER_STATS, {
        params: {
          key: config.STEAM.API_KEY,
          steamid: queryId,
          appid: appId,
        },
      })
      .then(function (response) {
        Logger.info(`Data has been fetched.`);
        req.data = response.data.playerstats;
        next();
      })
      .catch(function (error) {
        Logger.error(
          "400 : BAD REQUEST : Data from this steamid was not fetched."
        );
        Logger.error(error.stack);
        res
          .status(400)
          .json({
            success: false,
            timestamp: getTime(),
            query: urlOrSteamID,
            fetchedQuery: queryId,
            data: "Data from this steamid was not fetched.",
          })
          .end();
      });
  } catch (error) {
    Logger.error("500 : SERVER ERROR : Server Error Occured");
    Logger.error(error.message);
    res.status(500).json({
      success: false,
      data: "Something went wrong.",
    });
  }
};

function getTime() {
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
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
  var out =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    ":" +
    mseconds;
  return out;
}
