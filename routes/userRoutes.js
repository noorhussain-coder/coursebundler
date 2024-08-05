import express, { Router } from "express"
import { addToPlaylist, changePassword, deleteMyProfile, deleteUser, forgetPassword, getAllUsers, getMyProfile, login, logout, register, removeFromPlaylist, resetPassword, updateProfile, updateProfilePicture, updateUserRole } from "../controllers/userController.js"
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js"
import singleUpload from "../middlewares/multer.js"



const router=express.Router()
// to Register a new user
router.route("/register").post(singleUpload,register)
//  login route
router.route("/login").post(login)
// logout route
router.route("/logout").get(logout)
// myprofile
router.route("/me").get(isAuthenticated, getMyProfile)
// delete own profile
router.route("/me").delete(isAuthenticated, getMyProfile,deleteMyProfile)
// dchanged password
router.route("/changepassword").put(isAuthenticated, changePassword )
// upateprofile
router.route("/updateprofile").put(isAuthenticated, updateProfile )
// update profile picture
router.route("/updateprofilepicture").put(isAuthenticated, singleUpload,updateProfilePicture )
// forgetpasword
router.route("/forgetpassword").post( forgetPassword )
// router.route("/forgetpassword").post(isAuthenticated, forgetPassword )
router.route("/resetpassword/:token").put( resetPassword )
// login  logout  get my profile  change password up[date]
// AddToplaylist video
router.route("/addtoplaylist").post(isAuthenticated,addToPlaylist)
// removefromplaylist
router.route("/removefromplaylist").delete(isAuthenticated,removeFromPlaylist)
// udateprofilepicture
//   forgetpassword resetpassword
// addto playlist
// remove from playlist
// admin Route
router.route("/admin/users").get(isAuthenticated,authorizeAdmin,getAllUsers)
router.route("/admin/users/:id").put(isAuthenticated,authorizeAdmin,updateUserRole)
.delete(isAuthenticated,authorizeAdmin,deleteUser)
export default router
