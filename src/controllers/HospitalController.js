import HospitalService from "../services/HospitalService";

let handleGetTopHospital = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await HospitalService.getTopHospitalHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let handleCreateNewHospital = async (req, res) => {
  try {
    let info = await HospitalService.createNewHospitalService(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log("Get all code errrrr", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleEditHospital = async (req, res) => {
  let data = req.body;
  console.log("dataaaa", data);
  let message = await HospitalService.updateHospitalService(data);
  return res.status(200).json(message);
};

let handleGetAllHospital = async (req, res) => {
  try {
    let info = await HospitalService.getAllHospitalService();
    return res.status(200).json(info);
  } catch (e) {
    console.log("Get All hospital errrrr", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleGetHospitalWithType = async (req, res) => {
  try {
    const type = req.query.type;
    let info = await HospitalService.getHospitalWithTypeService(type);
    return res.status(200).json(info);
  } catch (e) {
    console.log("Get hospital with type errrrr", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleGetInfoHospitalById = async (req, res) => {
  try {
    let info = await HospitalService.getInfoHospitalByIdService(req.query.id);
    return res.status(200).json(info);
  } catch (e) {
    console.log("Get all code errrrr", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleCreateNewHospital: handleCreateNewHospital,
  handleGetAllHospital: handleGetAllHospital,
  // getInfoHospitalById, getInfoHospitalById
  handleGetTopHospital: handleGetTopHospital,
  handleEditHospital: handleEditHospital,
  handleGetHospitalWithType: handleGetHospitalWithType,
  handleGetInfoHospitalById: handleGetInfoHospitalById,
};
