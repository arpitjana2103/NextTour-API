exports.catchAsyncErrors = function (asyncFunc) {
    return function (req, res, next) {
        asyncFunc(req, res, next).catch(next);
    };
};
