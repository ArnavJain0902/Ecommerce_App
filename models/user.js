// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;
// const Product = require("../models/product")

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items:[]}
//     this._id = id;
//   }

//   async save() {
//     try {
//       const db = getDb();
//       const result = await db.collection("users").insertOne(this);
//       return result;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async getCart() {
//     const db = getDb();
//     const productIds = [];
//     const quantities = {}; //{"wdiwjdidjw" : qty}

//     this.cart.items.forEach((product) => {
//       productIds.push(product.productId);
//       quantities[product.productId] = product.quantity;
//     });

//     const result = await db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray();

//     return result.map((product) => {
//       return { ...product, quantity: quantities[product._id] };
//     });
//   }

//   async addToCart(product) {
//     try {
//       if (!this.cart) {
//         this.cart = { items: [] };
//       }
//       const updatedCartItems = [...this.cart.items];
//       const cartProductIndex = this.cart.items.findIndex((cartItem) => {
//         return cartItem.productId.toString() === product._id.toString();
//       });

//       let newQuantity = 1;
//       if (cartProductIndex >= 0) {
//         newQuantity = this.cart.items[cartProductIndex].quantity + 1; //fetch old qty and +1
//         updatedCartItems[cartProductIndex].quantity = newQuantity; //replace in new cart
//       } else {
//         updatedCartItems.push({
//           productId: new mongodb.ObjectId(product._id),
//           quantity: newQuantity,
//         });
//       }
//       const updatedCart = { items: updatedCartItems }; //update cart
//       const db = getDb();
//       return await db.collection("users").updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } } // get the user and update his cart
//       );
//     } catch (err) {
//       console.log("Error in addToCart:", err);
//       throw err;
//     }
//   }
//   async deleteFromCart(prodId) {
//     try {
//       const db = getDb();
//       const id = new mongodb.ObjectId(prodId);
//       let productIndex = this.cart.items.findIndex((product) => {
//         return product.productId.toString() === id.toString();
//       });
//       let updatedCartItems = [...this.cart.items];
//       if (updatedCartItems[productIndex].quantity > 1) {
//         updatedCartItems[productIndex].quantity -= 1;
//       } else {
//         updatedCartItems.splice(productIndex, 1);
//       }

//       const updatedCart = { items: updatedCartItems };

//       await db.collection("users").updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         {
//           $set: {
//             cart: updatedCart,
//           },
//         }
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async addOrder() {
//     const db = getDb();
//     const products=await this.getCart()
//     console.log(products);
//     const orders = {
//       items: products,
//       users: 
//       { 
//         id: new mongodb.ObjectId(this._id),
//         name: this.name, 

//       },
//     };
//     await db.collection("orders").insertOne(orders);
//     this.cart = { items: [] };
//     return db.collection("users").updateOne(
//       { _id: this._id },
//       {
//         $set: {
//           cart: this.cart,
//         },
//       }
//     );
//   }

//   async getOrders(){
//     const db = getDb();
//     const orders = await db.collection("orders").find().toArray()
//     return orders
//   }

//   static async findById(userId) {
//     try {
//       const db = getDb();
//       const result = await db
//         .collection("users")
//         .findOne({ _id: new mongodb.ObjectId(userId) });
//       return result;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }

// module.exports = User

const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password:{
    type:String,
    required:true
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId,ref:'Product', required: true },
        quantity: { type:Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (product) {
  try {
    if (!this.cart) {
      this.cart = { items: [] };
    }
    const updatedCartItems = [...this.cart.items];
    const cartProductIndex = this.cart.items.findIndex((cartItem) => {
      return cartItem.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1; //fetch old qty and +1
      updatedCartItems[cartProductIndex].quantity = newQuantity; //replace in new cart
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity,
      });
    }
    const updatedCart = { items: updatedCartItems }; //update cart
    this.cart = updatedCart;
    return this.save();
  } catch (err) {
    console.log("Error in addToCart:", err);
    throw err;
  }
};

userSchema.methods.deleteFromCart = async function(prodId){
    try {
      let productIndex = this.cart.items.findIndex((product) => {
        return product.productId.toString() === prodId;
      });
      let updatedCartItems = [...this.cart.items];
      if (updatedCartItems[productIndex].quantity > 1) {
        updatedCartItems[productIndex].quantity -= 1;
      } else {
        updatedCartItems.splice(productIndex, 1);
      }

      const updatedCart = { items: updatedCartItems };
      this.cart = updatedCart
      return this.save()
    } catch (err) {
      console.log(err);
    }

}


module.exports = mongoose.model("User", userSchema);