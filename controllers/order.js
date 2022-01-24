const { off } = require("npm");
const { Order, ProductCart } = require("../models/order");
 
exports.getOrderById =(req, res ,next ,id) => {
  Order.findById(id)
  .populate("products.prodcut", "name price")
  .exec((err , order) =>{
      if ( err || !order) {
          res.status(400).json({
              error : "No order found in DB"
          })
      }
      res.order = order ;
      next();
  })
}

//create order :

exports.createOrder = (res, req) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err , order) => {
        if(err || !order) {
            return res.sttus(400).json({
                Error : "Not Able to create Order"
            })
        }
        res.json(order);
    })
}

exports.getAllOrders = (req, res) =>{
    Order.find()
    .populate("user", "_id name")
    .exec((err , orders) => {
        if(err) {
            return res.status(400).json({
                error : "Orders not found"
            })
        }

        res.json(orders)
    })
}

exports.getOrderStatus = (res, req) => {
     res.json(Order.schema.path("status").enumValues)

}

exports.updateStatus = (res, req) => {
    Order.update({_id : req.body.orderId}, 
        { $set : {status : req.body.status}},
        (err , order) => {
            if(err || !order) {
                return res.status(400).json({
                    error : "Cannot update Order status"
                })
            }
            res.json(order);
        })
}