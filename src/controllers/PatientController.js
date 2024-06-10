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
  try {
    let info = await PatientService.getListPatientBooking(req.query);
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
};
