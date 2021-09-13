const colors = require('colors');
console.clear();
console.clear();
console.log(" //-----------------------------------koshurTech gStats v0.0.1-----------------------------------// \n".bgBlue.bold);

//Imports 
const express = require('express');
const dotenv = require('dotenv').config({ path: "./config/config.env" });





//Start
console.log(getTime() + " : Launching Express Server Framework...");
const app = new express();
app.use(express.json());


//
try {
    console.log(getTime() + " : Launching Routes...");


    // Route SET 1
    app.use('/api/getUserStatistics', require('./routes/getVideoGamePlayerStatisticsFromSteam'));


    console.log(getTime() + " : All routes launched successfully.".green.bold);

}
catch (error) {
    console.log(error);
    console.log(getTime() + " : Routes were not launched successfully.".red.bold);
}



app.listen(process.env.PORT, () => {
    console.log(getTime() + " : Server is running at port " + ` ${process.env.PORT} `.white.bold.bgRed);
});

//sdfkjahskjfhaskjhfjk

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