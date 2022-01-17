const { ObjectId } = require("mongoose");
const mongoose = require("mongoose")
const {ObjectID} = required("mongoose")

const ProductCartSchema = new mongoose.Schema ({
    product : {
        type : ObjectID,
        ref : "Product"
    },
    name : String,
    count : Number,
    price : Number,

})
const orderSchema = new mongoose.Schema({
   products : [ProductCartSchema],
   transaction_id : {},
   amount   : {type : Number},
   address  : String,
   updated  : Date,
   user : {
       type :ObjectId,
       ref : "User"
   }, 

},{timestamps : true});

const Order = mongoose.model("Order",orderSchema);
const ProductCar = mongoose.model("ProductCart",ProductCartSchema)
module.exports = {Order,ProductCar};