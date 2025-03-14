// const mongodb = require('mongodb')
// const getDb = require("../util/database").getDb;

// class Product {
//   constructor({ id, title, price, description, imageUrl , userId}) {
//     this._id = new mongodb.ObjectId(id);
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.userId = userId;
//   }

//   async save() {
//     try {
//       const db = getDb();
//       const result = await db.collection("products").insertOne(this);
//       return result;
//     } catch (err) {
//       console.log("Some error occurred while saving");
//       throw err;
//     }
//   }

//   static async fetchAll() {
//     try {
//       const db = getDb();
//       const products = await db.collection("products").find().toArray();
//       return products;
//     } catch (err) {
//       console.log("Some error occurred while fetching");
//       throw err;
//     }
//   }

//   static async findById(prodId) {
//     try {
//       const db = getDb();
//       const product = await db
//         .collection("products")
//         .findOne({ _id: new mongodb.ObjectId(prodId) });
//       return product;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async update(
//     prodId,
//     updatedTitle,
//     updatedPrice,
//     updatedDesc,
//     updatedImageUrl
//   ) {
//     try {
//       const db = getDb();
//       const result = await db.collection("products").updateOne(
//         { _id: new mongodb.ObjectId(`${prodId}`) },
//         {
//           $set: {
//             title: updatedTitle,
//             price: updatedPrice,
//             imageUrl: updatedImageUrl,
//             description: updatedDesc,
//           },
//         }
//       );
//       console.log("Updated successfully!");
//       return result;
//     } catch (err) {
//       console.log("Some error occurred while updating");
//       throw err;
//     }
//   }

//   static async delete(productId,userId) {
//     try {
//       const db = getDb();
//       await db.collection("users").updateOne({_id:new mongodb.ObjectId(userId)},{
//         $pull:{
//           'cart.items' : {productId : new mongodb.ObjectId(productId)},
//         }
//       })
//       const result = await db
//         .collection("products")
//         .deleteOne({ _id: new mongodb.ObjectId(productId) });
//       console.log("Deleted successfully!");
//       return result;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }
// module.exports = Product;

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  imageUrl:{
    type:String,
    required:true
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
});


module.exports = mongoose.model('Product', productSchema);