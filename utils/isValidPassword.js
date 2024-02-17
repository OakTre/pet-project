const bcrypt = require('bcryptjs');

module.exports = function isValidPassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword)
}
