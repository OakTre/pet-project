module.exports = function mapUser(user) {
    return {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        sex: user.sex,
        birthday: user.birthday,
        city: user.city,
        children: user.children,
        height: user.height,
        relationship: user.relationship,
        smoking: user.smoking,
        animals: user.animals,
        interests: user.interests,
        languages: user.languages,
        company: user.company,
        education: user.education,
        roles: user.roles,
    }
};
