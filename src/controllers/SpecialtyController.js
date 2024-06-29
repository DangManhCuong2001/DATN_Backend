import SpecialtyService from "../services/SpecialtyService";

let handleGetAllSpecialty = async (req, res) => {
  try {
    let info = await SpecialtyService.getAllSpecialtyService();
    return res.status(200).json(info);
  } catch (e) {
    console.log("Get errrrr", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleCreateNewSpecialty = async (req, res) => {
  try {
    console.log("dsfsdf", req.body);
    let info = await SpecialtyService.createNewSpecialtyService(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log("Create specialty errrrr", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleGetListSpecialtybyHospital = async (req, res) => {
  try {
    let info = await SpecialtyService.getListSpecialtybyHospitalService(
      req.query.hospitalId
    );
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
  handleGetAllSpecialty: handleGetAllSpecialty,
  handleCreateNewSpecialty: handleCreateNewSpecialty,
  handleGetListSpecialtybyHospital: handleGetListSpecialtybyHospital,
};
