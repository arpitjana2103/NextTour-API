const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/tour.model");

dotenv.config({ path: "./config.env" });

const DBLOC = process.env.DATABASE_LOCAL;

mongoose.connect(DBLOC).then(function () {
    console.log("DB connection successfull!");
});

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// IMPORT DATA INTO DB
const importData = async function () {
    try {
        await Tour.create(tours);
        console.log("Data imported successfully");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async function () {
    try {
        await Tour.deleteMany();
        console.log("Data Deleted Successfully !");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
