const { Categorie } = require('../models/categorie.models');
const { Product } = require('../models/product.models');
const { AppError } = require('../utils/appError.util');
const { ProductsImgs } = require('../models/productImgs.models');

const { catchAsync } = require('../utils/catchAsync');
const { uploadProductImgs } = require('../utils/firebase.util');

const createProduct = catchAsync(async (req, res, next) => {
    const { title, description, price, categoryId, quantity } = req.body;
    const { sessionUser } = req;

    const newProduct = await Product.create({
        title,
        description,
        price,
        categoryId,
        quantity,
        userId: sessionUser.id,
    });

    await uploadProductImgs(req.files, newProduct.id);

    res.status(201).json({
        status: 'success',
        data: { newProduct },
    });
});

const getAllProducts = catchAsync(async (req, res, next) => {
    const AllProducts = await Product.findAll({
        where: { status: 'active' },

        include: [
            {
                model: ProductsImgs,
            },
        ],
    });
    res.status(200).json({
        status: 'success',
        data: { AllProducts },
    });
});

const getIdProducts = catchAsync(async (req, res, next) => {
    const { product } = req;

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const { title, description, price, quantity } = req.body;
    const { product } = req;
    const { sessionUser } = req;

    if (sessionUser.id === product.userId) {
        await product.update({ title, description, price, quantity });
        res.status(201).json({
            status: 'success',
            data: { product },
        });
    }
    next(new AppError('the product was not created by this user'));
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const { product } = req;
    const { sessionUser } = req;

    if (sessionUser.id === product.userId) {
        await product.update({ status: 'inactive' });
        res.status(204).json({
            status: 'success',
        });
    }
    next(new AppError('the product was not created by this user'));
});

const createCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    const newCategory = await Categorie.create({ name });

    res.status(201).json({
        status: 'success',
        data: { newCategory },
    });
});

const getCategorie = catchAsync(async (req, res, next) => {
    const getCategorie = await Categorie.findAll({
        where: { status: 'active' },
    });
    res.status(200).json({
        status: 'success',
        data: { getCategorie },
    });
});

const updateCategories = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const categorie = await Categorie.findOne({ where: { id } });

    if (!categorie) {
        return next(new AppError('this category does not exist', 400));
    }
    await categorie.update({ name });

    res.status(201).json({
        status: 'success',
        data: { categorie },
    });
});

module.exports = {
    createProduct,
    getAllProducts,
    getIdProducts,
    updateProduct,
    deleteProduct,
    createCategory,
    getCategorie,
    updateCategories,
};
