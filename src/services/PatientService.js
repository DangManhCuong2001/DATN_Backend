import db from "../models/index";
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

module.exports = {
  bookAppointment: bookAppointment,
  getListPatientBooking: getListPatientBooking,
  verifyBookAppointment: verifyBookAppointment,
  getAppointmentsPatientServices: getAppointmentsPatientServices,
};
