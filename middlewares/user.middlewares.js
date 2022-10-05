const { User } = require('../models/user.models');

const { catchAsync } = require('../utils/catchAsync');

const usersExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'this user do not exists',
        });
    }

    req.user = user;
    next();
});

module.exports = {
    usersExists,
};
