const Product = require("../models/product");
const User = require("../models/user")
const Order =require("../models/order");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      // .select("title price imageUrl description")
      // .populate("userId", "name");
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Products",
      path: "/products",
      isAuthenticated:req.session.isLoggedIn
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      isAuthenticated:req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);

    await res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};



exports.getCart = async (req, res, next) => {
  try {
    await req.session.user.populate("cart.items.productId");
    const cartProducts = req.session.user.cart.items
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cartProducts,
      isAuthenticated:req.session.isLoggedIn
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const product = await Product.findById(prodId);
    const plainProduct = {
      _id: product._id.toString(),
      title: product.title,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
    };
    const result = await req.session.user.addToCart(plainProduct);
    req.session.save((err)=>{
      if(!err){
        res.redirect("/cart");
      }
    })
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'users.userId': req.session.user._id });
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated:req.session.isLoggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.postOrders = async (req, res, next) => {
  try {
    await req.session.user.populate("cart.items.productId");
    const products = req.session.user.cart.items.map((i) => {
      return { product: { ...i.productId._doc }, quantity: i.quantity };
    });
    const order = new Order({
      products: products,
      users: { userId: req.session.user._id, email: req.session.user.email },
    });
    await order.save();
    await User.findByIdAndUpdate(
      { _id: req.session.user._id },
      {
        cart: { items: [] },
      }
    );
    req.session.user.cart = { items: [] };
    req.session.save((err) => {
      if (!err) {
        res.redirect("/orders");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await req.session.user.deleteFromCart(prodId)
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
