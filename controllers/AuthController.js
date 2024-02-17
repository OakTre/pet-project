const AuthService = require('../service/AuthService.js');
const ApiError = require('../lib/HandleError.js');
const { validationResult } = require('express-validator');

class AuthController {
    async login(req, res, next) {
        try {
            const user = await AuthService.login(req.body, req.get('User-Agent'));
            res.cookie('refreshToken', user.data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            res.json(user);
        } catch (error) {
            next(error)
        }
    }

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const user = await AuthService.registration(req.body);
            res.cookie('refreshToken', user.data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            res.json(user);
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await AuthService.logout(refreshToken);
            res.clearCookie('refreshToken')
            res.json(token);
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await AuthService.activate(activationLink);

            return res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const user = await AuthService.refresh(refreshToken);
            res.cookie('refreshToken', user.data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            res.json(user);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController();
