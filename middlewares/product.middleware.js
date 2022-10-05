const { Product } = require('../models/product.models');
const { ProductsImgs } = require('../models/productImgs.models');

const { catchAsync } = require('../utils/catchAsync');

const existsProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findOne({
        where: { id },
        include: [
            {
                model: ProductsImgs,
                where: { productId: id },
            },
        ],
    });
    if (!product) {
        res.status(404).json({
            status: 'error',
            message: 'this product is not exists',
        });
    }

    req.product = product;
    next();
});

module.exports = {
    existsProduct,
};
