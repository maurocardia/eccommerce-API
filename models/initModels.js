const {User} = require("./user.models")
const {Product} = require ("./product.models")
const {ProductsInCart} = require("./productsInCart.models")
const {ProductsImgs} = require("./productImgs.models")
const {Order} = require("./order.models")
const {Categorie} = require("./categorie.models")
const {Cart} = require("./cart.model")

const initModels = () =>{
  User.hasMany(Product,{foreignKey:"userId"});
  Product.belongsTo(User);

  User.hasMany(Order), {foreignKey:"userId"};
  Order.belongsTo(User);

  User.hasOne(Cart, {foreignKey:"userId"});
  Cart.belongsTo(User);

  Product.hasMany(ProductsImgs, {foreignKey:"productId"});
  ProductsImgs.belongsTo(Product);

  Categorie.hasOne(Product, {foreignKey:"categoryId"});
  Product.belongsTo(Categorie);

  Cart.hasMany(ProductsInCart, {foreignKey:"cartId"});
  ProductsInCart.belongsTo(Cart);

  Product.hasOne(ProductsInCart, {foreignKey:"productId"});
  ProductsInCart.belongsTo(Product);

  Cart.hasOne(Order, {foreignKey:"cartId"});
  Order.belongsTo(Cart);
}

module.exports = {initModels}
