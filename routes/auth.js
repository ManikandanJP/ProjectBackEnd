const express = require("express");
const { check } = require("express-validator");
const app = express();
const router = express.Router();

const { signout, signup, signin } = require("../controllers/auth");

router.post("/signup",[
    check("name","name must be at least 5 chars long").isLength({ min: 3 }),
    check("email","email is required").isEmail(),
    check("password","password should be at least 3 chars").isLength({min: 3})
], signup);

router.post("/signin",[
    check("email","email is required").isEmail(),
    check("password","password is required ").isLength({min: 1})
], signin);

router.get("/signout", signout);

module.exports = router;
