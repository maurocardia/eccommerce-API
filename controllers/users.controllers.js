const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/user.models');
const { Product } = require('../models/product.models');
const { Order } = require('../models/order.models');
const { ProductsInCart } = require('../models/productsInCart.models');
const { Cart } = require('../models/cart.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const createUser = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    newUser.password = undefined;
    res.status(201).json({
        status: 'succes',
        data: { newUser },
    });
});

const loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email, status: 'active' },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('wron credential', 400));
    }
    user.password = undefined;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(200).json({
        status: 'success',
        data: { user, token },
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { user, sessionUser } = req;
    const { name, email } = req.body;

    if (sessionUser.id !== user.id) {
        return next(
            new AppError(
                'you do not have sufficient permissions to delete this user'
            )
        );
    }

    await user.update({ email, name });

    res.status(204).json({
        status: 'succes',
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { user, sessionUser } = req;

    if (sessionUser.id !== user.id) {
        return next(
            new AppError(
                'you do not have sufficient permissions to delete this user'
            )
        );
    }
    await user.update({ status: 'inactive' });

    res.status(204).json({
        status: 'succes',
    });
});

const getAllProductsUser = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const products = await Product.findAll({
        where: { status: 'active', userId: sessionUser.id },
    });

    res.status(200).json({
        status: 'success',
        data: { products },
    });
});

const getAllOrderUser = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const orders = await Order.findAll({
        where: { status: 'active', userId: sessionUser.id },
        include: [
            {
                model: Cart,
                where: { status: 'purchased', userId: sessionUser.id },
                attributes: ['id'],
                include: {
                    model: ProductsInCart,

                    attributes: ['id', 'productId', 'quantity'],
                },
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { orders },
    });
});

const getOrderById = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { id } = req.params;

    const order = await Order.findOne({
        where: { id },
        include: [
            {
                model: Cart,
                where: { status: 'purchased', userId: sessionUser.id },
                attributes: ['id'],
                include: {
                    model: ProductsInCart,

                    attributes: ['id', 'productId', 'quantity'],
                },
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { order },
    });
});

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllProductsUser,
    getAllOrderUser,
    getOrderById,
};
