
import express from "express"
import { isAuthenticated } from "../middlewares/auth.js";
// import { buySubscription, getRazorPayKey, paymentVerification,can, cancelSubscribtion } from "../controllers/paymentController";
import { contact, courseReqest, getDashboardStatus } from "../controllers/otherController.js";

const router =express.Router();

// contact from
router.route("/contact").post(contact)
// Request form
router.route("/courserequest").post(courseReqest)

// get Admin dashboad
router.route("/admin/status").get(getDashboardStatus)



export default router