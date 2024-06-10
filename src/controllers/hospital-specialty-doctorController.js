import HospitalSpecialtyDoctor from "../services/hospital-specialty-doctorService";

let handleGetTest = async (req, res) => {
  try {
    let info = await HospitalSpecialtyDoctor.getTestService();
    return res.status(200).json(info);
  } catch (e) {
    console.log("Get errrrr", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleGetTest: handleGetTest,
};
