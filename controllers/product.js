const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");
const { sortBy } = require("lodash");
exports.getProductById = (res, req, next, id) => {
  Product.find(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          errror: "Product not found in DB",
        });
      }
      req.product = product;
      next();
    });
};

/* exports.createProduct = (req, res) => {
  // use formidable
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  // parse formidable object and it returns three values Error , Files , Fields
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }

    //destructure the fields :

    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all the mandatory fields",
      });
    }

    // TODO: handle fields Restriction with fields
    console.log(fields)

    //TODO: restrictions on field
    let product = new Product(fields);


    // Work with Images
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too big",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save DB

    Product.save((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Saving Tshirts in DB is failed",
        });
      }
      res.json(product);
    });
  });
};
*/
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //TODO: restrictions on field
    //destructure the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }
    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// delete controller
exports.deleteProduct = (res, req) => {
  let Product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to Delete the product",
      });
    }
    res.json({
      message: "Deletion was sucess",
      deletedProduct,
    });
  });
};

// update Controller
exports.updateProduct = (res, req) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    // Updation code

    let product = req.product;
    product = _.extend(product, fields);
    //handle file here

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updatation of tshirt in DB failed",
        });
      }
      res.json(product);
    });
  });
};

// retrieve all products:

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .populate("category")
    .sort([[sortBy, "asc"]])
    .select("-photo") /*  negatie sign to ignore photo*/
    .limit(limit)
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "No Products found",
        });
      }
      res.json(products);
    });
};

// list Categories :

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      res.status(400).json({
        error: "Categories not Found in db",
      });
    }
    res.json(category);
  });
};
// middleware

exports.photo = (res, req, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.Order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod.id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkwrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
