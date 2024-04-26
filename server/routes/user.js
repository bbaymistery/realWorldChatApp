const router = require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
//!User Controllers are  protected 

router.patch("/update-me", authController.protect, userController.updateMe);
router.post("/get-users", authController.protect, userController.getUsers);


module.exports = router;