const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.get("/doctors", userController.getDoctorsBasicInfo);


module.exports = router;