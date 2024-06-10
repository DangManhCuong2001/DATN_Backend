import db from "../models/index";
require("dotenv").config();

let bookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await db.Booking.create({
          id: data.id,
          statusId: "S1",
          doctorId: data.doctorSelected,
          hospitalId: data.hospitalSelected,
          patientId: data.patientId,
          date: data.daySelected,
          timeType: data.hourSelected,
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

let getListPatientBooking = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await db.Specialty.findAll();
        if (data && data.length > 0) {
          data.map((item) => {
            if (item.image) {
              item.image = Buffer.from(item.image, "base64").toString("binary");
            }
            return item;
          });
        }
        resolve({
          errMessage: "ok",
          errCode: 0,
          specialtys: data,
        });
      } catch (e) {
        reject(e);
      }
    });
  };



module.exports = {
  bookAppointment: bookAppointment,
  getListPatientBooking:getListPatientBooking
};
