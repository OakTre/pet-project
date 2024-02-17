const UserService = require('../service/UserService.js');
const { validationResult } = require("express-validator");
const ApiError = require("../lib/HandleError");

class UserController {
    async create(req, res, next) {
        try {
            const user = await UserService.create(req.body)
            res.json(user);
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await UserService.getAll()

            return res.json(users)
        } catch (error) {
            next(error)
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;

            const user = await UserService.getOne(id);

            return res.json(user);
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const { id } = req.params;
            const user = req.body

            const updatedUser = await UserService.update(user, id)

            return res.json(updatedUser)
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const user = await UserService.delete(id);

            return res.json(user)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController();
