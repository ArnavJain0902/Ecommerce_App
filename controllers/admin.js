const Product = require("../models/product");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated:req.session.isLoggedIn,
    error:null,
    hasError:null,
    product:{title:null, imageUrl:null, price:null, description:null}
  });
};

exports.postAddProduct = async (req, res) => {
  try {
    const errors = validationResult(req)
    console.log(errors.array());
    console.log(req.body);
    if(!errors.isEmpty()){
      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: true,
        isAuthenticated:req.session.isLoggedIn,
        error:errors.array()[0].msg,
        hasError:true,
        product:req.body
      });
    }
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.session.user._id,
    });
    await product.save();
    req.session.save((err)=>{
      if(!err){
        return res.redirect("/");
      } else{
        console.log("error while saving session");
      }
    })
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  if (!product) {
    return res.redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
    product: product,
    isAuthenticated:req.session.isLoggedIn,
    hasError:false,
    error:null,
  });
};

exports.postEditProduct = async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        editing: true,
        product:req.body,
        isAuthenticated:req.session.isLoggedIn,
        hasError:true,
        error:errors.array()[0].msg,
      });
    }
    const {
      productId: productId,
      title: updatedTitle,
      price: updatedPrice,
      description: updatedDesc,
      imageUrl: updatedImageUrl,
    } = req.body;
    const product = await Product.findById(productId);
    if(product.userId !== req.session.user._id){
      return res.redirect("/")
    }
    
    await Product.findByIdAndUpdate(
      { _id: productId },
      {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        imageUrl: updatedImageUrl,
      }
    );
    req.session.save((err)=>{
      if(!err){
        return res.redirect("/admin/products");
      } else{
        console.log("error while saving session");
      }
    })
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({userId:req.session.user._id});
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ "message": "Product not found" });
    }
    
    if (product.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ "message": "Not authorized" });
    }
    
    const newCartItems = [...req.session.user.cart.items];
    const productIndex = req.session.user.cart.items.findIndex((p) => {
      return p.productId.toString() === productId.toString();
    });
    
    if (productIndex >= 0) {
      newCartItems.splice(productIndex, 1);
    }
    
    const newCart = { items: newCartItems };
    
    await Product.findByIdAndDelete(productId);
    await User.findByIdAndUpdate(
      { _id: req.session.user._id },
      { cart: newCart }
    );
    
    req.session.save((err) => {
      if (!err) {
        return res.status(200).json({ "message": "success" });
      }
      throw new Error("Session save failed");
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ "message": "deleting product failed" });
  }
};
