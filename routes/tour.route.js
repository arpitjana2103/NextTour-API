const express = require("express");
const tourController = require("../controllers/tour.controller");

const tourRouter = express.Router();

tourRouter.route("/").get(tourController.createTour);

module.exports = tourRouter;
