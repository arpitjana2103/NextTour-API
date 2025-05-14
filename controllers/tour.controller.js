const Tour = require("../models/tour.model");
const QueryFeatures = require("../utils/QueryFeatures");
const { catchAsyncErrors } = require("./error.controller");

exports.createTour = catchAsyncErrors(async function (req, res, next) {
    const newTour = await Tour.create(req.body);
    return res.status(201).json({
        status: "success",
        data: { tour: newTour },
    });
});

exports.getAllTours = catchAsyncErrors(async function (req, res, next) {
    const mongooseQuery = Tour.find();
    const queryFeatures = new QueryFeatures(mongooseQuery, req.query);
    const query = queryFeatures
        .filter()
        .sort()
        .limitFields()
        .paginate().mongooseQuery;

    const tours = await query;

    return res.status(200).json({
        status: "success",
        count: tours.length,
        data: { tours: tours },
    });
});

exports.aliasTop5Cheap = catchAsyncErrors(async function (req, res, next) {
    req.query = Object.assign(req.query, {
        limit: "5",
        sort: "price,-ratingsAverage",
        fields: "name,price,ratingsAverage,summery,difficulty,duration",
    });
    next();
});

exports.getTour = catchAsyncErrors(async function (req, res, next) {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    // if(!tour){}

    return res.status(200).json({
        status: "success",
        data: { tour: tour },
    });
});

exports.updateTour = catchAsyncErrors(async function (req, res, next) {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    // if(!tour) {}

    return res.status(200).json({
        status: "success",
        data: { tour: tour },
    });
});

exports.deleteTour = catchAsyncErrors(async function (req, res, next) {
    const { id } = req.params;
    const tour = await Tour.findByIdAndDelete(id);

    // if(!tour){}

    return res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getTourStats = async function (req, res) {
    console.log("Hello from tour-stats");
    const stats = await Tour.aggregate([
        { $match: { ratingsAverage: { $gte: 4.5 } } },
        {
            $group: {
                // _id: null
                // _id: "$difficulty",
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
            },
        },
        {
            $sort: {
                avgRating: -1,
            },
        },
    ]);

    return res.status(200).json({
        status: "success",
        data: { stats: stats },
    });
};
