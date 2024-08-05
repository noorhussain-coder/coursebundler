// import express from "express"
// const router =express.Router();
// export default router


import express from "express"
import { isAuthenticated } from "../middlewares/auth";
import { buySubscription, getRazorPayKey, paymentVerification,can, cancelSubscribtion } from "../controllers/paymentController";

const router =express.Router();

// Buy subscription
router.route("/subscribe").get(isAuthenticated,buySubscription)
// verify payment and save reference to database
router.route("/paymentverification").post(isAuthenticated,paymentVerification)

router.route("/razorpaykey").get(isAuthenticated,getRazorPayKey)
router.route("/subscribtion/cancel").delete(isAuthenticated,cancelSubscribtion)

export default router