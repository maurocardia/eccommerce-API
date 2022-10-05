const { ProductsInCart } = require('../models/productsInCart.models');
const { Cart } = require('../models/cart.model');
const { Order } = require('../models/order.models');
const { Product } = require('../models/product.models');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError.util');

const addProducts = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const { sessionUser, cartMax } = req;

    const products = await Product.findOne({ where: { id: productId } });
    const productsIncart = await ProductsInCart.findOne({
        where: { cartId: cartMax[0].id },
    });

    if (JSON.stringify(cartMax) === '') {
        newCart = await Cart.create({ userId: sessionUser.id });
        cartMax[0] = newCart;
    } else if (cartMax[0].status !== 'active' || !cartMax[0].status) {
        newCart = await Cart.create({ userId: sessionUser.id });
        cartMax[0] = newCart;
    }

    if (quantity > products.quantity) {
        return next(
            new AppError(
                'This amount exceeds the maximum units of the product',
                400
            )
        );
    } else if (productsIncart === null) {
        newCartProduct = await ProductsInCart.create({
            productId,
            quantity,
            cartId: cartMax[0].id,
        });
    } else if (
        productsIncart.productId === productId &&
        productsIncart.status === 'active'
    ) {
        return next(new AppError('this product has already been added', 400));
    } else if (productsIncart.status === 'removed') {
        const newCartProduct = await ProductsInCart.findOne({
            where: { cartId: cartMax[0].id },
        });

        await newCartProduct.update({ status: 'active', productId, quantity });
    } else {
        newCartProduct = await ProductsInCart.create({
            productId,
            quantity,
            cartId: cartMax[0].id,
        });
    }

    res.status(201).json({
        status: 'success',
        data: { newCartProduct },
    });
});

const updateProductCart = catchAsync(async (req, res, next) => {
    const { productId, newQty } = req.body;
    const { cartMax } = req;

    const products = await Product.findOne({ where: { id: productId } });

    const actualProduct = await ProductsInCart.findOne({
        where: { cartId: cartMax[0].id, productId },
    });
   
    if (newQty > products.quantity) {
        return next(
            new AppError(
                'This amount exceeds the maximum units of the product',
                400
            )
        );
    } else if (newQty === 0) await actualProduct.update({ status: 'removed' });

    await actualProduct.update({ quantity: newQty, status: 'active' });

    res.status(200).json({
        status: 'success',
        data: { actualProduct },
    });
});

const deleteProductCart = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const { cartMax } = req;

    const actualProduct = await ProductsInCart.findOne({
        where: { status: 'active', cartId: cartMax[0].id, productId },
    });
    if (!actualProduct) {
        return next(new AppError('This product no exists in the cart', 400));
    }
    await actualProduct.update({ status: 'removed', quantity: 0 });
    res.status(204).json({
        status: 'success',
    });
});

const purchaseCart = catchAsync(async (req, res, next) => {
    const { cartMax, sessionUser } = req;

    const activeCart = await ProductsInCart.findAll({
        where: { cartId: cartMax[0].id, status: 'active' },
        include: [
            {
                model: Product,
                attributes: ['title', 'quantity', 'price'],
            },
        ],
    });

    const product = await Product.findAll({ where: { status: 'active' } });

    const arrPrice = activeCart.map(function (price) {
        return price.product.price * price.quantity;
    });

    const totalPrice = arrPrice.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
    );

    activeCart.map(function (product) {
        return product.update({ status: 'purchased' });
    });

    for (let i = 0; i < product.length; i++) {
        const productId = product[i].id;
        activeCart.map(function (cart) {
            if (cart.productId === productId) {
                return product[i].update({
                    quantity: product[i].quantity - cart.quantity,
                });
            }
        });
    }

    const createOrder = await Order.create({
        cartId: cartMax[0].id,
        userId: sessionUser.id,
        totalPrice: totalPrice,
    });
    await cartMax[0].update({ status: 'purchased' });

    res.status(200).json({
        status: 'success',
        data: { createOrder },
    });
});

module.exports = {
    addProducts,
    updateProductCart,
    deleteProductCart,
    purchaseCart,
};
