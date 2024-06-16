import PatientService from "../services/PatientService";

let handleBookAppointment = async (req, res) => {
  try {
    let info = await PatientService.bookAppointment(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleGetListPatientForDoctor = async (req, res) => {
  console.log(req.query);
  try {
    let info = await PatientService.getListPatientBooking(
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

let handleVerifyBookAppointment = async (req, res) => {
  try {
    let info = await PatientService.verifyBookAppointment(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleGetAppointmentsPatient = async (req, res) => {
  console.log(req.query);
  try {
    let info = await PatientService.getAppointmentsPatientServices(
      req.query.userId
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

module.exports = {
  handleBookAppointment: handleBookAppointment,
  handleGetListPatientForDoctor: handleGetListPatientForDoctor,
  handleVerifyBookAppointment: handleVerifyBookAppointment,
  handleGetAppointmentsPatient: handleGetAppointmentsPatient,
};
