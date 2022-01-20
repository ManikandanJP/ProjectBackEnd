const express = require("express");
const { check } = require("express-validator");
const app = express();
const router = express.Router();


const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {getProductById , createProduct, getProduct,deleteProduct,updateProduct,getAllProducts, photo} = require("../controllers/product")

// param :
router.param("userId", getUserById);
router.param("productId", getProductById);

// rounters
// create routes
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)

// read routers
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

// delete routers :
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct )
// update routers :
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct )
// listing routers :

router.get("/products", getAllProducts);

module.exports = router;