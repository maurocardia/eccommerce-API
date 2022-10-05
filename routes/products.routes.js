const express = require('express');

const {
    createProduct,
    getAllProducts,
    getIdProducts,
    updateProduct,
    deleteProduct,
    createCategory,
    getCategorie,
    updateCategories,
} = require('../controllers/products.controllers');
const { protectSession } = require('../middlewares/auth.middleware');
const { existsProduct } = require('../middlewares/product.middleware');
const {
    createProductsValidators,
} = require('../middlewares/validators.middleware');

const { upload } = require('../utils/multer.util');
const productsRouter = express.Router();

productsRouter.get('/', getAllProducts);
productsRouter.get('/categories', getCategorie);
productsRouter.get('/:id', existsProduct, getIdProducts);

productsRouter.use(protectSession);

productsRouter.post(
    '/',
    upload.array('productImg', 5),
    createProductsValidators,
    createProduct
);
productsRouter.patch('/:id', existsProduct, updateProduct);
productsRouter.delete('/:id', existsProduct, deleteProduct);
productsRouter.post('/categories', createCategory);
productsRouter.patch('/categories/:id', updateCategories);

module.exports = { productsRouter };
