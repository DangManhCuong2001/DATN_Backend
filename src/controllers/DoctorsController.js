import doctorService from "../services/DoctorService";

let handleGetAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleSaveInfoDoctors = async (req, res) => {
  try {
    let response = await doctorService.saveInfoDoctorsService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleGetInfoDoctors = async (req, res) => {
  try {
    let info = await doctorService.getInfoDoctorService(req.query.id);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleGetProfileDoctor = async (req, res) => {
  try {
    let info = await doctorService.getProfileDoctorsServices(
      req.query.doctorId
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleListDoctorByHospital = async (req, res) => {
  try {
    let info = await doctorService.getListDoctorByHospitalService(
      req.query.hospitalId,
      req.query.specialtyId
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleBulkCreateSchedule = async (req, res) => {
  try {
    let info = await doctorService.bulkCreateScheduleServices(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleGetScheduleDoctors = async (req, res) => {
  try {
    let info = await doctorService.getScheduleDoctorsServices(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleDoneAppointment = async (req, res) => {
  try {
    let info = await doctorService.doneAppointmentService(req.body);
    console.log(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

module.exports = {
  handleGetAllDoctors: handleGetAllDoctors,
  handleSaveInfoDoctors: handleSaveInfoDoctors,
  handleGetInfoDoctors: handleGetInfoDoctors,
  handleListDoctorByHospital: handleListDoctorByHospital,
  handleBulkCreateSchedule: handleBulkCreateSchedule,
  handleGetScheduleDoctors: handleGetScheduleDoctors,
  handleDoneAppointment: handleDoneAppointment,
};
