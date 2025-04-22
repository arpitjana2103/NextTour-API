const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "##-A-Tour-Must-Have-A-Name-##"],
            unique: true,
            trim: true,
            maxLength: [40, "##-Max-Length-Should-Be-40-##"],
            minLength: [10, "##-Min-Length-Shold-Be-10-##"],
        },
        slug: {
            type: String,
        },
        duration: {
            type: Number,
            required: [true, "##-A-Tour-Must-Have-A-Duration-##"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "##-A-Tour-Must-Have-A-Size-##"],
        },
        difficulty: {
            type: String,
            required: [true, "##-A-Tour-Must-Have-A-Difficulty-##"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message:
                    '##-Difficulty-Enum-Values-Be-"easy","medium","difficult"-##',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "##-RatingsAverage-Must-Be-Above-Or-Equels-1.0-##"],
            max: [5, "##-RatingsAverage-Must-Be-Below-Or-Equels-2.0-##"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "##-A-Tour-Must-Have-A-Price-##"],
        },
        priceDiscount: {
            type: Number,
            // Will Not Worked while update ...
            // Only workd while creating new docs ...
            validate: {
                validator: function (discount) {
                    return this.price > discount;
                },
                message: "##-PriceDiscount-Must-Be-Less-Than-Price-##",
            },
        },
        summery: {
            type: String,
            trim: true,
            required: [true, "##-A-Tour-Must-Have-A-Summery-##"],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, "##-A-Tour-Must-Have-A-Cover-Image-##"],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            defalult: false,
            select: false,
        },
        startLocation: {
            type: {
                type: String,
                default: "Point",
                enum: ["Point"],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: "Point",
                    enum: ["Point"],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toOBJECT: { virtuals: true },
    }
);

////////////////////////////////////////
// Virtual Fields //////////////////////

tourSchema.virtual("durationWeeks").get(function () {
    return Number((this.duration / 7).toFixed(1));
});

////////////////////////////////////////
// DOCUMENT MIDDLEWARE / HOOK //////////

// runs before Model.prototype.save() and Model.create()
tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// runs after Model.prototype.save() and Model.create()
tourSchema.post("save", function (doc, next) {
    doc.__v = "Arpit Jana is Great";
    next();
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
