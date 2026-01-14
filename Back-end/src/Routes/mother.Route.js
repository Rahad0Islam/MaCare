import { Router } from "express";
import { upload } from "../Middleware/Multer.Middleware.js";
import { jwtVerification } from "../Middleware/Authentication.Middleware.js";
import { addSelfVisit, getMaternalRecord, getMotherProfile, getVaccineSchedule, registerChild } from "../Controllers/mother.controller.js";

const router=Router();

router.route('/getMotherProfile').get(jwtVerification,getMotherProfile)
router.route('/getMaternalRecord').get(jwtVerification,getMaternalRecord)
router.route('/addSelfVisit').get(jwtVerification,addSelfVisit)
router.route('/registerChild').get(jwtVerification,registerChild)
router.route('/getVaccineSchedule').get(jwtVerification,getVaccineSchedule)

export default router