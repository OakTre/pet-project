const ApiError = require('../lib/HandleError.js');
const TokenService = require("../service/TokenService.js");

module.exports = async function (req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const header = req.headers.authorization;
        if (!header) {
            return next(ApiError.Unauthorizederror())
        }

        const TOKEN = req.headers.authorization.split(' ')[1];
        if (!TOKEN) {
            return next(ApiError.Unauthorizederror())
        }

        const userData = TokenService.validateAccessToken(TOKEN);

        if (!userData) {
            return next(ApiError.Unauthorizederror())
        }

        req.user = userData;

        next();
    } catch (error) {
        next(ApiError.Unauthorizederror());
    }
}
