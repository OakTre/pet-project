const bcrypt = require('bcryptjs');

module.exports = async function hashPassword(password) {
    const hashed = await bcrypt.hashSync(password, 7);

    return hashed;
};
