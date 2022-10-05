const express = require('express');

const {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllProductsUser,
    getAllOrderUser,
    getOrderById,
} = require('../controllers/users.controllers');
const { protectSession } = require('../middlewares/auth.middleware');
const { usersExists } = require('../middlewares/user.middlewares');
const {
    createUserValidators,
} = require('../middlewares/validators.middleware');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);
usersRouter.post('/login', loginUser);

usersRouter.use(protectSession);

usersRouter.get('/me', getAllProductsUser);
usersRouter.patch('/:id', usersExists, updateUser);
usersRouter.delete('/:id', usersExists, deleteUser);
usersRouter.get('/orders', getAllOrderUser);
usersRouter.get('/orders/:id', getOrderById);

module.exports = { usersRouter };
