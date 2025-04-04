const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require("../middleware/is-auth")
const router = express.Router();
const validator = require("../middleware/is-valid-product");

//Protecting routes
router.use(isAuth); 

// // /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// // // /admin/products => GET
router.get('/products', adminController.getProducts);

// // // /admin/add-product => POST
router.post(
  "/add-product",
  validator.titleCheck,
  validator.priceCheck,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);
router.delete('/product/:productId',adminController.deleteProduct);

module.exports = router;
