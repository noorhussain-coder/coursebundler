import express from "express"
import { adddLecture, createCourse, deleteCourse, deleteLecture, getAllCourses, getCourseLectures } from "../controllers/courseController.js"
import singleUpload from "../middlewares/multer.js"
import { authorizeAdmin, authorizeSubscribers, isAuthenticated } from "../middlewares/auth.js"

const router=express.Router()
// router.route("./courses").get(getAllCourses)
// i have created mistake  ./courses insteed of /courses
// Get all courses without lecture
router.route("/courses").get(getAllCourses)
// create new course - only admin
router.route("/createcourse").post(isAuthenticated,authorizeAdmin ,singleUpload ,createCourse)
// add lecture ,dlete lecture , get course details
// router.route("/createcourse").post(createCourse)
router.route("/course/:id")
// see the lecture 
// we add authorize subscribers
// .get(isAuthenticated,getCourseLectures,authorizeSubscribers)
.get(isAuthenticated,getCourseLectures)
// add lecture create lecture
.post(isAuthenticated,authorizeAdmin,singleUpload,adddLecture)
.delete(isAuthenticated,authorizeAdmin,deleteCourse)
router.route("/lecture")
.delete(isAuthenticated,authorizeAdmin,deleteLecture)
// delete course
export default router;    