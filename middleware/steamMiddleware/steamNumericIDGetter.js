const axios = require("axios");
const ini = require("ini");
const fs = require("fs");
const Logger = require("../../Logger");

const config = ini.parse(fs.readFileSync("./serverConfig/config.ini", "utf-8"));

module.exports = async function (req, res, next) {
  Logger.info("Steam Numeric ID getter middleware launched.");
  if (req.queryId == null) {
    axios
      .get(config.STEAM.CONVERT_STEAM_URL_TO_STEAM_ID, {
        params: { key: config.STEAM.API_KEY, vanityurl: req.parsedId },
      })
      .then(function (response) {
        Logger.info(
          "200 : OK : URL was decoded and steamid was fetched, getting video game statistics..."
        );
        req.queryId = response.data.response.steamid;
        next();
      })
      .catch(function (error) {
        Logger.error(
          "400 : BAD REQUEST : Steam URL was not converted into steamid."
        );
        Logger.error(error.message);
        res
          .status(400)
          .json({
            success: false,
            data: "Steam URL was not converted into steamid.",
          })
          .end();
      });
  } else {
    next();
  }
};
