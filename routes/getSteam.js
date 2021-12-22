//imports
const express = require("express");
const router = express.Router();
const Logger = require("../Logger");
const ini = require("ini");
const fs = require("fs");
const steamIDDetector = require("../middleware/steamMiddleware/steamIDDetector");
const steamNumbericIDGetter = require("../middleware/steamMiddleware/steamNumericIDGetter");
const getUserStatsById = require("../middleware/steamMiddleware/getUserStatsById");

const config = ini.parse(fs.readFileSync("./serverConfig/config.ini", "utf-8"));

router.get(
  "/",
  steamIDDetector,
  steamNumbericIDGetter,
  getUserStatsById,
  async (req, res) => {
    try {
      const urlOrSteamID = req.query.urlOrSteamID;
      const appId = req.query.appId;
      const queryId = req.queryId;
      const dataFetched = req.data;
      res.status(200).json({
        success: true,
        timestamp: getTime(),
        appId: appId,
        query: urlOrSteamID,
        fetchedQuery: queryId,
        data: dataFetched,
      });
    } catch (error) {
      Logger.error("500 : SERVER ERROR : Server Error Occured");
      Logger.error(error.stack);
      res.status(500).json({
        success: false,
        timestamp: getTime(),
        data: "Something went wrong.",
      });
    }
  }
);

function isSubstring(s1, s2) {
  var M = s1.length;
  var N = s2.length;

  /* A loop to slide pat[] one by one */
  for (var i = 0; i <= N - M; i++) {
    var j;

    /* For current index i, check for
 pattern match */
    for (j = 0; j < M; j++) if (s2[i + j] != s1[j]) break;

    if (j == M) return i;
  }

  return -1;
}
function checkIfURLisValid(str) {
  var pattern = new RegExp(
    "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)"
  ); // fragment locator
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
module.exports = router;
