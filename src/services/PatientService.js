import { Op } from "sequelize";
import db, { Sequelize, sequelize } from "../models/index";
require("dotenv").config();
import emailSerService from "./emailService";

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
            statusId: "S2",
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

module.exports = {
  bookAppointment: bookAppointment,
  getListPatientBooking: getListPatientBooking,
  verifyBookAppointment: verifyBookAppointment,
  getAppointmentsPatientServices: getAppointmentsPatientServices,
  saveRatePointService: saveRatePointService,
  getListRatePointServices: getListRatePointServices,
  searchDataService: searchDataService,
};
