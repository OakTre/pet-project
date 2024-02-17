const jwt = require("jsonwebtoken");
const Session = require("../models/Session.js");
const ApiError = require("../lib/HandleError");
const SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH;

class TokenService {
    generateAccessToken(payload) {
        try {
            const token = jwt.sign(payload, SECRET, { expiresIn: '30d' });
            const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });

            return {
                token,
                refreshToken
            };
        } catch (error) {
            throw ApiError.BadRequest('Ошибка! :(')
        }
    }

    async saveToken(userId, refreshToken) {
        try {
            const tokenData = await Session.findOne({ user: userId })

            if (tokenData) {
                tokenData.refreshToken = refreshToken;

                return tokenData.save();
            }

            const token = await Session.create({ user: userId, refreshToken});

            return token;
        } catch (error) {
            throw ApiError.BadRequest('Ошибка! :(')
        }
    }


    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, SECRET);

            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, REFRESH_SECRET);

            return userData;
        } catch (error) {
            return null;
        }
    }

    async removeToken(refreshToken) {
        const tokenData = await Session.deleteOne({refreshToken});

        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await Session.findOne({refreshToken});

        return tokenData;
    }
}

module.exports = new TokenService();
