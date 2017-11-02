'use strict';

const mongoose = require("mongoose");
//const dbURI = "mongodb://localhost/elmonitor";
const dbURI = "mongodb://mongo/elmonitor";

mongoose.connect(dbURI);

mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection connected to " + dbURI);
});

mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

mongoose.connection.on("open", function () {
  console.log("Mongoose default connection open");
});

mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected from " + dbURI);
});

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("Ma, oii");
    process.exit(0);
  })
})
