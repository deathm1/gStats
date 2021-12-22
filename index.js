//imports
const express = require("express");
const ini = require("ini");
const fs = require("fs");
const Logger = require("./Logger");

const config = ini.parse(fs.readFileSync("./serverConfig/config.ini", "utf-8"));

const app = new express();
app.use(express.json());

try {
  Logger.info("Initializing Routes...");

  app.use("/api/getUserStatistics", require("./routes/getSteam"));

  Logger.info("All routs were initialized successfully.");
} catch (error) {
  Logger.info(error.stack);
  Logger.error("Something went wrong while initializing routes.");
}

app.listen(config.SERVER_CONFIG.PORT, () => {
  console.log(
    `Server is running at secure PORT : ${config.SERVER_CONFIG.PORT}`
  );
});
