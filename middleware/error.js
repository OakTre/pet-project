const ApiError = require('../lib/HandleError.js');

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
        })
    }

    return res.status(500).json({
        success: false,
        message: 'Хмм.. Ошибочка прилетела',
        error: err
    })
};
