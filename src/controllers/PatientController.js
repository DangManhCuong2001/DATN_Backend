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

let handleSaveRatePoint = async (req, res) => {
  try {
    let info = await PatientService.saveRatePointService(req.body);
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

let handleGetListRatePoint = async (req, res) => {
  console.log("cuongggg", req.query);
  try {
    let info = await PatientService.getListRatePointServices(
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

let handleSearchData = async (req, res) => {
  try {
    let info = await PatientService.searchDataService(req.query.keyword);
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

let handleGetstatistical = async (req, res) => {
  try {
    let info = await PatientService.getStatisticalService();
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleGetstatisticalHospitalChart = async (req, res) => {
  try {
    let info = await PatientService.getStatisticalHospitalChartService();
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleGetstatisticalAppointmentChart = async (req, res) => {
  try {
    let info = await PatientService.getStatisticalAppointmentChartService();
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleGetAppointmentIn7Day = async (req, res) => {
  try {
    let info = await PatientService.getAppointmentIn7DayService();
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
  handleSaveRatePoint: handleSaveRatePoint,
  handleGetListRatePoint: handleGetListRatePoint,
  handleSearchData: handleSearchData,
  handleGetstatistical: handleGetstatistical,
  handleGetstatisticalHospitalChart: handleGetstatisticalHospitalChart,
  handleGetstatisticalAppointmentChart: handleGetstatisticalAppointmentChart,
  handleGetAppointmentIn7Day: handleGetAppointmentIn7Day,
};
