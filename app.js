const express = require("express");

const app = express();

app.get("/", function (req, res) {
    res.status(200).json({
        message: "A new Hello from Server",
        app: "NextTours",
    });
});

module.exports = app;
