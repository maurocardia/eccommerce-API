const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/user.models');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid session',
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
        where: { id: decoded.id, status: 'active' },
    });
    if (!user) {
        return res.status(403).json({
            status: 'error',
            message: 'The owner of the session is no longer active',
        });
    }
    req.sessionUser = user;
    next();
});

module.exports = {
    protectSession,
};
