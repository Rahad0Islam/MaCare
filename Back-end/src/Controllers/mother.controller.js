import { User } from "../Models/User.Model.js";
import { MaternalRecord } from "../Models/Maternal.model.js";
import { ChildRecord } from "../Models/ChildRecord.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsynHandler } from "../Utils/AsyncHandler.js";

// 1. Get mother profile
const getMotherProfile = AsynHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-Password -RefreshToken");

  if (!user || user.Role !== "mother")
     throw new ApiError(403, "Access denied");
   
   console.log("mother profile fetched");
  return res.status(200).json(new ApiResponse(200, user, "Mother profile fetched"));
});

// 2. Get maternal record
const getMaternalRecord = AsynHandler(async (req, res) => {

  const record = await MaternalRecord.findOne({ motherID: req.user._id });
  if (!record) throw new ApiError(404, "Maternal record not found");
  
  console.log("Maternal record fetched");
  return res.status(200).json(new ApiResponse(200, record, "Maternal record fetched"));
});

// 3. Add self-reported visit
const addSelfVisit = AsynHandler(async (req, res) => {
  const { date, weightKg, bp, notes } = req.body;

  if(date==="" || weightKg==="" || bp===""){
     throw new ApiError("all feilds are required! ");
  }

  const record = await MaternalRecord.findOne({ motherID: req.user._id });
  if (!record) throw new ApiError(404, "Maternal record not found");

  record.visits.push({ date, weightKg, bp, notes, providerID: req.user._id });
  await record.save();
   
  console.log("visit added");
  return res.status(201).json(new ApiResponse(201, record.visits.slice(-1)[0], "Visit added"));
});

// 4. Register child
const registerChild = AsynHandler(async (req, res) => {
  const { name, dob, sex } = req.body;
  const child = await ChildRecord.create({
    motherID: req.user._id,
    child: { name, dob, sex }
  });
  return res.status(201).json(new ApiResponse(201, child, "Child registered"));
});

// 5. View vaccine schedule
const getVaccineSchedule = AsynHandler(async (req, res) => {
  const child = await ChildRecord.findById(req.params.childId);

  if (!child || child.motherID.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }
  return res.status(200).json(new ApiResponse(200, child.vaccines, "Vaccine schedule fetched"));
});




export {
    getMotherProfile,
    getMaternalRecord,
    addSelfVisit,
    registerChild,
    getVaccineSchedule,
  

}