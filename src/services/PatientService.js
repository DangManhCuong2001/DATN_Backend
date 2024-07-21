import { Op, where } from "sequelize";
import db, { Sequelize, sequelize } from "../models/index";
require("dotenv").config();
import emailSerService from "./emailService";
const moment = require("moment");
import bcrypt from "bcryptjs";

let bookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        console.log(data);
        await emailSerService.sendEmail({
          recieverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.fullNameDoctor,
          linkConfirm: `${process.env.URL_REACT}/verify-booking?token=${data.id}&doctorId=${data.doctorSelected}`,
        });
        await db.Booking.create({
          id: data.id,
          statusId: "S1",
          doctorId: data.doctorSelected,
          hospitalId: data.hospitalSelected,
          patientId: data.patientId,
          date: data.daySelected,

          timeType: data.hourSelected,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          reason: data.reason,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
        });
        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListPatientBooking = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            [Op.or]: [{ statusId: "S2" }, { statusId: "S3" }],
            doctorId: doctorId,
            date: date,
          },
        });
        resolve({
          errCode: 0,
          listPatientBook: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let verifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        const appoinment = await db.Booking.findOne({
          where: {
            id: data.token,
            doctorId: data.doctorId,
            statusId: "S1",
          },
          raw: false,
        });

        if (appoinment) {
          appoinment.statusId = "S2";
          await appoinment.save();
          resolve({
            errCode: 0,
            errMessage: "ok",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "not found appointment or actived!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAppointmentsPatientServices = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            // statusId: "S2",
            patientId: userId,
          },
          include: [
            { model: db.User, attributes: ["firstName", "lastName"] },
            { model: db.RatePoint, attributes: ["point"] },
          ],
        });
        if (!data) data = [];
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let saveRatePointService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.appointmentId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        console.log(data);
        const rate = await db.RatePoint.findOne({
          where: {
            appointmentId: data.appointmentId,
          },
          raw: false,
        });

        if (!rate) {
          await db.RatePoint.create({
            id: data.id,
            appointmentId: data.appointmentId,
            userId: data.userId,
            doctorId: data.doctorId,
            point: data.point,
            rateContent: data.contentRate,
          });
          resolve({
            errCode: 0,
            errMessage: "Đánh giá thành công!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Ban da danh gia roi!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListRatePointServices = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    console.log("dsfsdfsd", doctorId);
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.RatePoint.findAll({
          where: {
            doctorId: doctorId,
          },
          include: [
            { model: db.User, attributes: ["firstName", "lastName", "image"] },
          ],
        });
        if (data) {
          data.map((item) => {
            if (item.User.image) {
              item.User.image = Buffer.from(item.User.image, "base64").toString(
                "binary"
              );
              return item;
            }
          });
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let searchDataService = (keyword) => {
  return new Promise(async (resolve, reject) => {
    console.log("dsfsdfsd", keyword);
    try {
      if (!keyword) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let dataUser = await db.User.findAll({
          // limit: 10,
          where: {
            [Op.or]: [
              {
                lastName: { [Op.like]: "%" + keyword + "%" },
                roleId: "doctor",
              },
              {
                firstName: { [Op.like]: "%" + keyword + "%" },
                roleId: "doctor",
              },
            ],
          },
        });
        let dataHospital = await db.Hospital.findAll({
          // limit: 10,
          where: {
            [Op.or]: [{ name: { [Op.like]: "%" + keyword + "%" } }],
          },
        });
        // console.log(data);
        if (dataUser) {
          dataUser.map((item) => {
            if (item.image) {
              item.image = Buffer.from(item.image, "base64").toString("binary");
              return item;
            }
          });
        }
        if (dataHospital) {
          dataHospital.map((item) => {
            if (item.image) {
              item.image = Buffer.from(item.image, "base64").toString("binary");
              return item;
            }
          });
        }
        resolve({
          errCode: 0,
          data: { dataUser, dataHospital },
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getStatisticalService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let totalAppointment = await db.Booking.count();
      let totalHospital = await db.Hospital.count();
      let totalSpecialty = await db.Specialty.count();
      let totalDoctor = await db.Doctor_Info.count();
      resolve({
        errCode: 0,
        data: { totalAppointment, totalHospital, totalSpecialty, totalDoctor },
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getStatisticalHospitalChartService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let totalAppointment = await db.Booking.count({
        where: { statusId: "S3" },
      });
      let totalAppByHospital = await db.Booking.findAll({
        where: { statusId: "S3" },
        attributes: [
          "hospitalId",
          [
            Sequelize.fn("COUNT", Sequelize.col("Booking.id")),
            "appointmentCount",
          ],
        ],
        include: [{ model: db.Hospital, attributes: ["name"] }],
        group: "hospitalId",
      });
      // let totalSpecialty = await db.Specialty.count();
      // let totalDoctor = await db.Doctor_Info.count();
      resolve({
        errCode: 0,
        data: { totalAppointment, totalAppByHospital },
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getStatisticalAppointmentChartService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let totalAppointment = await db.Booking.count();
      let totalAppByStatusS1 = await db.Booking.count({
        where: { statusId: "S1" },
      });
      let totalAppByStatusS2 = await db.Booking.count({
        where: { statusId: "S2" },
      });
      let totalAppByStatusS3 = await db.Booking.count({
        where: { statusId: "S3" },
      });
      // let totalSpecialty = await db.Specialty.count();
      // let totalDoctor = await db.Doctor_Info.count();
      resolve({
        errCode: 0,
        data: {
          totalAppointment,
          dataByStatus: [
            {
              totalAppByStatus: totalAppByStatusS1,
              name: "Lượt đặt khám chờ xác nhận",
            },
            {
              totalAppByStatus: totalAppByStatusS2,
              name: "Lượt đặt khám chờ khám",
            },
            {
              totalAppByStatus: totalAppByStatusS3,
              name: "Lượt đặt khám đã hoàn thành",
            },
          ],
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAppointmentIn7DayService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy ngày hiện tại và 7 ngày trước
      const today = moment().endOf("day").toDate();
      const sevenDaysAgo = moment().subtract(7, "days").startOf("day").toDate();

      // Lấy dữ liệu trong 7 ngày gần nhất
      const recentData = await db.Booking.findAll({
        where: {
          createdAt: {
            [Op.between]: [sevenDaysAgo, today],
          },
        },
        attributes: ["createdAt"],
        order: [["createdAt", "DESC"]],
      });

      // Đếm số lượng bản ghi theo từng ngày
      const countPerDay = new Map();
      recentData.forEach((record) => {
        const dateStr = moment(record.createdAt).format("MM-DD"); // chỉ lấy ngày và tháng
        if (moment(dateStr, "MM-DD", true).isValid()) {
          const count = countPerDay.get(dateStr) || 0;
          countPerDay.set(dateStr, count + 1);
        } else {
          console.error(`Invalid date: ${record.createdAt}`);
        }
      });

      // Tạo danh sách tất cả các ngày trong khoảng thời gian 7 ngày gần nhất
      const allDates = [];
      for (let m = moment(sevenDaysAgo); m.isBefore(today); m.add(1, "days")) {
        const dateStr = m.format("MM-DD");
        const count = countPerDay.get(dateStr) || 0;
        allDates.push({ date: dateStr, count });
      }

      resolve({
        errCode: 0,
        data: allDates,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let CancelAppointmentService = (appointmentID) => {
  return new Promise(async (resolve, reject) => {
    try {
      let app = await db.Booking.findOne({
        where: { id: appointmentID },
      });
      if (!app) {
        resolve({
          errCode: 2,
          errMessage: `Lịch hẹn không tồn tại`,
        });
      }
      await db.Booking.destroy({
        where: { id: appointmentID },
      });

      resolve({
        errCode: 0,
        message: "Huy thanh cong",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let EditProfileService = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data);
    try {
      if (
        !data.id ||
        !data.firstName ||
        !data.lastName ||
        !data.address ||
        !data.phoneNumber ||
        !data.gender ||
        !data.image
      ) {
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
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.gender = data.gender;
        user.image = data.image;
        await user.save();
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

const salt = bcrypt.genSaltSync(10);
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let EditPasswordService = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data);
    try {
      if (
        !data.id ||
        !data.oldPassword ||
        !data.newPassword ||
        !data.reNewPassword
      ) {
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
        let hashNewPasswordFromBcrypt = await hashUserPassword(
          data.newPassword
        );

        console.log(
          "dfsdfds",
          bcrypt.compareSync(data.oldPassword, user.password),
          hashNewPasswordFromBcrypt
        );
        if (!bcrypt.compareSync(data.oldPassword, user.password)) {
          resolve({
            errCode: 3,
            errMessage: "incorrect password",
          });
        }
        if (data.newPassword !== data.reNewPassword) {
          resolve({
            errCode: 4,
            errMessage: "incorrect reNewPassword",
          });
        } else {
          user.password = hashNewPasswordFromBcrypt;
          await user.save();
          resolve({
            errCode: 0,
            message: "Update success",
          });
        }
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

let searchHospitalService = (keyword, typeHospital) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!keyword || !typeHospital) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Hospital.findAll({
          where: {
            type: typeHospital,
            [Op.or]: [{ name: { [Op.like]: "%" + keyword + "%" } }],
          },
        });
        if (data) {
          data.map((item) => {
            if (item.image) {
              item.image = Buffer.from(item.image, "base64").toString("binary");
              return item;
            }
          });
        }
        resolve({
          errCode: 0,
          listHospital: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  bookAppointment: bookAppointment,
  getListPatientBooking: getListPatientBooking,
  verifyBookAppointment: verifyBookAppointment,
  getAppointmentsPatientServices: getAppointmentsPatientServices,
  saveRatePointService: saveRatePointService,
  getListRatePointServices: getListRatePointServices,
  searchDataService: searchDataService,
  getStatisticalService: getStatisticalService,
  getStatisticalHospitalChartService: getStatisticalHospitalChartService,
  getStatisticalAppointmentChartService: getStatisticalAppointmentChartService,
  getAppointmentIn7DayService: getAppointmentIn7DayService,
  CancelAppointmentService: CancelAppointmentService,
  EditProfileService: EditProfileService,
  EditPasswordService: EditPasswordService,
  searchHospitalService: searchHospitalService,
};
