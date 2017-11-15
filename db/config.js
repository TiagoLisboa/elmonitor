'use strict';

const mongoose = require("mongoose");
//const dbURI = "mongodb://localhost/elmonitor";
const dbURI = "mongodb://mongo/elmonitor";

const connect = () => {
	return mongoose.connect(dbURI, (err) => {
		if (err) {
			console.error('Failed to connect at mongo on startup - retrying in 5 sec');
			setTimeout(connect, 5000)
		}
	})
}
connect()

mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection connected to " + dbURI);
});

mongoose.connection.on("error", function (err) {
  console.error("Mongoose default connection error: ", err);
});

mongoose.connection.on("open", function () {
  console.log("Mongoose default connection open");
});

mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected from " + dbURI);
});

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  })
})
