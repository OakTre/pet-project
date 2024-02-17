module.exports = class HandleError extends Error {
    status;
    errors;

    constructor(status, message, errors=[]) {
        super(message);

        this.status = status;
        this.errors = errors;
    }

    static Unauthorizederror() {
        return new HandleError(401, 'Пользователь не авторизован');
    }

    static BadRequest(message, errors = []) {
        return new HandleError(400, message, errors);
    }
}
