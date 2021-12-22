const axios = require("axios");
const ini = require("ini");
const fs = require("fs");
const Logger = require("../../Logger");
var url = require("url");

function checkIfURLisValid(str) {
  var pattern = new RegExp(
    "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)"
  ); // fragment locator
  return !!pattern.test(str);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = async function (req, res, next) {
  Logger.info("Steam ID dectector middleware launched.");
  const urlOrSteamID = req.query.urlOrSteamID;
  const appId = req.query.appId;
  if (
    urlOrSteamID == "" ||
    urlOrSteamID == null ||
    appId == "" ||
    appId == null
  ) {
    Logger.error(
      "400 : BAD REQUEST : The request did not contain steamId, URL or appId."
    );
    res
      .status(400)
      .json({
        success: false,
        status: "The request did not contain steamId, URL or appId.",
      })
      .end();
  } else {
    if (checkIfURLisValid(urlOrSteamID)) {
      Logger.info("URL was tedtected.");
      var q = url.parse(urlOrSteamID, true);
      var arr = q.pathname.split("/");
      req.queryId = null;
      req.parsedId = arr[2];
      next();
    } else if (!isNumeric(urlOrSteamID) && !checkIfURLisValid(urlOrSteamID)) {
      Logger.info("Non-numeric/url query was detected.");
      req.queryId = null;
      req.parsedId = urlOrSteamID;
      next();
    } else if (isNumeric(urlOrSteamID)) {
      req.queryId = urlOrSteamID;
      Logger.info("Numeric Query was detected.");
      next();
    }
  }
};
