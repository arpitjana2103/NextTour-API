const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });
const DBLOC = process.env.DATABASE_LOCAL;
const PORT = process.env.PORT || 6600;

app.listen(PORT, function () {
    console.log("⌛ Connecting to Database...");

    // Connect with database
    mongoose
        .connect(DBLOC)
        .then(function () {
            console.log("✅ Database Connection Successfull.");
            console.log(`🔗 API URL : http://127.0.0.1:${PORT}/`);
        })
        .catch(function (err) {
            console.log("(ノಠ益ಠ)ノ Database Connection Failed.");
            console.log(err);
        });
});

const x = 0;
x = 5;
