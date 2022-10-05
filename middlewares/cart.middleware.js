const { Cart } = require('../models/cart.model');

const { catchAsync } = require('../utils/catchAsync');

const cartActived = catchAsync(async (req, res, next) => {
    const cartActive = await Cart.findAll({ status: 'active' });

    let cartMax = cartActive.sort((a, b) => {
        return Number.parseInt(b.id) - Number.parseInt(a.id);
    });

    req.cartMax = cartMax;
    next();
});

module.exports = {
    cartActived,
};
