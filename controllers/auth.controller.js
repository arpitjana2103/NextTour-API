const jwt = require("jsonwebtoken");
const { catchAsyncErrors, AppError } = require("./error.controller");
const User = require("../models/user.model");

const signToken = function (userId) {
    const payLoad = { id: userId };
    const jwtSecretKey = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(payLoad, jwtSecretKey, {
        expiresIn: jwtExpiresIn,
    });
    return token;
};

const signAndSendToken = function (user, statusCode, res) {
    const token = signToken(user._id);
    return res.status(statusCode).json({
        status: "success",
        token: token,
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
    });
};

exports.signup = catchAsyncErrors(async function (req, res, next) {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    signAndSendToken(user, 201, res);
});

exports.login = catchAsyncErrors(async function (req, res, next) {
    const { email, password } = req.body;

    // [1] Check If Email and Password exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }

    // [2] Check if User exists and Passwrod is correct
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.varifyPassword(password, user.password))) {
        return next(new AppError("Incorrect Email or Password", 401));
    }

    // [3] If everything ok, send Token to client
    signAndSendToken(user, 200, res);
});
