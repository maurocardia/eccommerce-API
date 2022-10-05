const express = require('express');

const {
    addProducts,
    updateProductCart,
    deleteProductCart,
    purchaseCart,
} = require('../controllers/carts.controllers');
const { protectSession } = require('../middlewares/auth.middleware');
const { cartActived } = require('../middlewares/cart.middleware');

const cartRouter = express.Router();

cartRouter.use(protectSession);
cartRouter.post('/add-product', cartActived, addProducts);
cartRouter.patch('/update-cart', cartActived, updateProductCart);
cartRouter.post('/purchase', cartActived, purchaseCart);
cartRouter.delete('/:productId', cartActived, deleteProductCart);

module.exports = { cartRouter };
