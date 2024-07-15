const UserService = require("../services/UserService");

let handeLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Vui long dien day du thong tin",
    });
  }

  let userData = await UserService.handleUserlogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetUsers = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing parameter",
      users: [],
    });
  }
  let users = await UserService.getUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  console.log("xx", req);
  let message = await UserService.createNewUser(req.body);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  // console.log("dataaa", req.body);

  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing parameters!",
    });
  }
  let message = await UserService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await UserService.updateUserData(data);
  return res.status(200).json(message);
};

let handleGetAllCode = async (req, res) => {
  try {
    let data = await UserService.getAllCodeServive(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Get all code errrrr", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handeLogin: handeLogin,
  handleGetUsers: handleGetUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleDeleteUser: handleDeleteUser,
  handleEditUser: handleEditUser,
  handleGetAllCode: handleGetAllCode,
};
