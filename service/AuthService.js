const User = require('../models/User');
const Session = require('../models/Session');
const EmailActivation = require('../models/EmailActivation');
const mapUser = require('../utils/dbMapUser');
const UserService = require('../service/UserService.js');
const ApiError = require('../lib/HandleError.js');
const TokenService = require("./TokenService");

class AuthService {
    async registration(user) {
        const candidate = await User.findOne({
            email: user.email
        });

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с адресом ${candidate.email} уже существует :(`)
        }

        const createdUser = await UserService.create(user)

        return { ...createdUser };
    }

    async login(user, ua) {
        const candidate = await User.findOne({
            email: user.email
        });

        if (!candidate) {
            throw ApiError.BadRequest(`Такого пользователя не существует :(`)
        }

        const isPasswordValid = await candidate.checkPassword(user.password, candidate.password)

        if (!isPasswordValid) {
            throw ApiError.BadRequest(`Неверный пароль :(`)
        }

        const userDto = mapUser(candidate)
        const tokens = TokenService.generateAccessToken({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            success: true,
            data: {
                ...mapUser(candidate),
                ...tokens
            }
        };
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            throw ApiError.BadRequest('А ты точно вошел в систему? :|')
        }

        const token = await TokenService.removeToken(refreshToken);

        return {
            success: true,
            data: {
                token
            }
        };
    }

    async activate(activationLink) {
        const user = await User.findOne({activationLink})

        if (!user) {
            throw ApiError.BadRequest(`Некорректная ссылка активации :(`)
        }

        const userActivationModel = await EmailActivation.findOne({
            user: user._id
        })

        userActivationModel.isActivated = true;
        await userActivationModel.save();
    }

    async refresh(token) {
        if (!token) {
            throw ApiError.Unauthorizederror()
        }

        const userData = TokenService.validateRefreshToken(token);
        const tokenDB = await TokenService.findToken(token);

        if (!userData || !tokenDB) {
            throw ApiError.Unauthorizederror();
        }

        const user = await User.findById(userData.id)
        const userDto = mapUser(user)
        const tokens = TokenService.generateAccessToken({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            success: true,
            data: {
                ...mapUser(user),
                ...tokens
            }
        };
    }
}

module.exports = new AuthService();
