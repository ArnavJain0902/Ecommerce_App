const mongoose = require("mongoose")
const Schema = require("mongoose").Schema

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity:{
        type:Number,
        required:true
      }
    },
  ],
  users: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true },
  },
});

module.exports = mongoose.model('Order',orderSchema)