const express = require("express");
const qs = require("qs");
const tourRouter = require("./routes/tour.route");

const app = express();

// req.query parser Middleware
// Set a custom query parser using qs
app.set("query parser", (str) => qs.parse(str));

// req.body parser Middleware :
// ‍[ note : Parses incoming JSON requests into JavaScript objects ]
app.use(express.json());

// Router Middlewares
app.use("/api/v1/tours", tourRouter);

module.exports = app;
