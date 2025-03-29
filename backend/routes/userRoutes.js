const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/google-login", userController.googleLogin);
router.post("/signup/send-otp", userController.sendSignupOTP);
router.post("/signup/verify-otp", userController.verifySignupOTP);
router.get("/profile", authMiddleware, userController.getUser);
router.post("/cashout", authMiddleware , userController.cashOut);

router.get('/invite', authMiddleware, userController.getInviteDetails);
router.post('/invite/send', authMiddleware, userController.sendInvite);
router.post('/invite/process', userController.processInviteAcceptance);
module.exports = router;