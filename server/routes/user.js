const router = require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
//!User Controllers are  protected 

router.patch("/update-me", authController.protect, userController.updateMe);


module.exports = router;