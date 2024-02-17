const User = require("../models/User");
const Role = require("../models/Role");
const EmailActivation = require('../models/EmailActivation');
const MailService = require("../service/EmailService.js")
const TokenService = require("../service/TokenService.js");
const mapUser = require("../utils/dbMapUser");
const ApiError = require('../lib/HandleError.js');

class UserService {
    async create(user) {
        const userRole = await Role.findOne({value: 'user'});
        user.roles = [userRole.value];

        const createdUser = await User.create(user);
        const userDto = mapUser(createdUser)
        await MailService.createEmailActivation(userDto.id)
        await MailService.sendActivationMail(createdUser.email, `${process.env.API_URL}/api/auth/activate/${createdUser.activationLink}` );
        const tokens = TokenService.generateAccessToken({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            success: true,
            data: {
                ...mapUser(createdUser),
                ...tokens
            }
        };
    }

    async getAll() {
        const users = await User.find({})

        return {
            success: true,
            data: [
                ...users.map((user) => ({...mapUser(user)}))
            ]
        }
    }

    async getOne(id) {
        if (!id) {
            throw ApiError.BadRequest(`Не указан ID :(`)
        }

        const user = await User.findById(id);

        if (!user) {
            throw ApiError.BadRequest(`Такого пользователя не существует :(`)
        }

        return {
            success: true,
            data: {
                ...mapUser(user._doc)
            }
        }
    }

    async update(user, id) {
        if (!id) {
            throw ApiError.BadRequest(`Не указан ID :(`)
        }

        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true } )

        return {
            success: true,
            data: {
                ...mapUser(updatedUser)
            }
        }
    }

    async delete(id) {
        if (!id) {
            throw ApiError.BadRequest(`Не указан ID :(`)
        }

        const user = await User.findByIdAndDelete(id);

        return {
            success: true,
            data: {
                ...mapUser(user)
            }
        }
    }
}

module.exports = new UserService();
