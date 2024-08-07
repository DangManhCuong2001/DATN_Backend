import bcrypt from "bcryptjs";
import { includes } from "lodash";
const db = require("../models");

const salt = bcrypt.genSaltSync(10);
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        console.log("user", user);

        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserlogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
            "gender",
            "phoneNumber",
            "image",
            "address",
          ],
          where: { email: email },
          include: [{ model: db.Doctor_Info, attributes: ["id"] }],
          raw: true,
        });
        if (user) {
          if (user.image) {
            user.image = Buffer.from(user.image, "base64").toString("binary");
          }
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Password khong chinh xac";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "Nguoi dung khong ton tai";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Email khong ton tai";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let getUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
        });
      }
      if (users) {
        users.map((item) => {
          if (item.image) {
            item.image = Buffer.from(item.image, "base64").toString("binary");
            return item;
          }
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};
let createNewUser = (data) => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      console.log(check);
      if (
        !data.email ||
        !data.password ||
        !data.id ||
        !data.firstName ||
        !data.address ||
        !data.lastName ||
        !data.phoneNumber ||
        !data.gender ||
        !data.image
      ) {
        resolve({
          errCode: 2,
          message: "missing parameter",
        });
      } else {
        if (check === true) {
          resolve({
            errCode: 1,
            message: "Email da duoc su dung, vui long thu email khac",
          });
        } else {
          let hashPasswordFromBcrypt = await hashUserPassword(data.password);
          await db.User.create({
            id: data.id,
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            roleId: data.roleId,
            // positionId: data.positionId,
            image: data.image,
          });
          resolve({
            errCode: 0,
            message: "ok",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: userId },
    });
    if (!user) {
      resolve({
        errCode: 2,
        errMessage: `nguoi dung khong ton tai`,
      });
    }
    await db.User.destroy({
      where: { id: userId },
    });
    resolve({
      errCode: 0,
      message: `nguoi dung da bi xoa`,
    });
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing parameter",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (user) {
        if (data.password) {
          let hashPasswordFromBcrypt = await hashUserPassword(data.password);
          user.password = hashPasswordFromBcrypt;
        }
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.image = data.image;
        await user.save();
        // await db.User.save({
        //     firstName: data.firstName,
        //     lastName: data.lastName,
        //     address: data.address,
        //     phonenumber: data.phonenumber,
        // })
        resolve({
          errCode: 0,
          message: "Update success",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// let getAllCodeServive = (typeInput) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!typeInput) {
//         resolve({
//           errCode: 1,
//           errMessage: "Missing parameter!",
//         });
//       }
//       let res = {};
//       let allcode = await db.Allcode.findAll({
//         where: { type: typeInput },
//       });
//       res.errCode = 0;
//       resolve(allcode);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

module.exports = {
  handleUserlogin: handleUserlogin,
  getUsers: getUsers,
  createNewUser: createNewUser,
  updateUserData: updateUserData,
  deleteUser: deleteUser,
  // getAllCodeServive: getAllCodeServive,
};
