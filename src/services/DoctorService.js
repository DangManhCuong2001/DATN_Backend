const db = require("../models");
import _ from "lodash";

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "doctor" },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        doctors: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let checkRequiredFields = (inputData) => {
  let arr = [
    "doctorSelected",
    // 'contentHTML', 'contentMarkdown', 'action',
    "price",
    // "selectedPayment",
    "province",
    // "addressClinic",
    "note",
    "specialtySelected",
    "hospitalSelected",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arr.length; i++) {
    if (!inputData[arr[i]]) {
      isValid = false;
      element = arr[i];
      break;
    }
  }
  return {
    isValid,
    element,
  };
};

let saveInfoDoctorsService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFields(inputData);
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing Parameter: ${checkObj.element}`,
        });
      } else {
        //UpSert table Markdown
        // if (inputData.action === "CREATE") {
        //   await db.Markdown.create({
        //     contentHTML: inputData.contentHTML,
        //     contentMarkdown: inputData.contentMarkdown,
        //     description: inputData.description,
        //     doctorId: inputData.doctorId,
        //   });
        // } else if (inputData.action === "EDIT") {
        //   let doctorMarkdown = await db.Markdown.findOne({
        //     where: { doctorId: inputData.doctorId },
        //     raw: false,
        //   });
        //   if (doctorMarkdown) {
        //     doctorMarkdown.contentHTML = inputData.contentHTML;
        //     doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
        //     doctorMarkdown.description = inputData.description;
        //     doctorMarkdown.updateAt = new Date();
        //     await doctorMarkdown.save();
        //   }
        // }

        //UpSert table doctorInfo
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: inputData.doctorSelected },
          raw: false,
        });
        if (doctorInfo) {
          // Update
          doctorInfo.id = inputData.id;
          doctorInfo.doctorId = inputData.doctorSelected;
          doctorInfo.priceId = inputData.price;
          doctorInfo.provinceId = inputData.province;
          // doctorInfo.paymentId = inputData.selectedPayment;
          // doctorInfo.nameClinic = inputData.nameClinic;
          // doctorInfo.addressClinic = inputData.addressClinic;
          doctorInfo.note = inputData.note;
          doctorInfo.specialtyId = inputData.specialtySelected;
          doctorInfo.clinicId = inputData.hospitalSelected;
          await doctorInfo.save();
        } else {
          // Create
          await db.Doctor_Info.create({
            id: inputData.id,
            doctorId: inputData.doctorSelected,
            priceId: inputData.price,
            provinceId: inputData.province,
            // paymentId: inputData.selectedPayment,
            // nameClinic: inputData.nameClinic,
            // addressClinic: inputData.addressClinic,
            note: inputData.note,
            specialtyId: inputData.specialtySelected,
            clinicId: inputData.hospitalSelected,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save data success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getInfoDoctorService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing Parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            // {
            //   model: db.Markdown,
            //   attributes: ["description", "contentHTML", "contentMarkdown"],
            // },
            // {
            //   model: db.Allcode,
            //   as: "positionData",
            //   attributes: ["valueVi"],
            // },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          doctorInfo: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListDoctorByHospitalService = (hospitalId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!hospitalId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let data = await db.Doctor_Info.findAll({
          where: {
            clinicId: hospitalId,
          },
          attributes: {
            exclude: ["id"],
          },
          include: [
            {
              model: db.User,
              attributes: {
                exclude: ["password"],
              },
            },
            {
              model: db.Specialty,
              attributes: ["name"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = [];
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

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let bulkCreateScheduleServices = (data) => {
  // console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }

        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatedDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });
        console.log("existing", existing);

        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        console.log("toCreate", toCreate);

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getScheduleDoctorsServices = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              // as: "timeTypeData",
              attributes: ["value"],
            },
          ],
          raw: false,
          nest: true,
        });
        console.log(dataSchedule);
        if (!dataSchedule) dataSchedule = [];
        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllDoctors: getAllDoctors,
  saveInfoDoctorsService: saveInfoDoctorsService,
  getInfoDoctorService: getInfoDoctorService,
  getListDoctorByHospitalService: getListDoctorByHospitalService,
  bulkCreateScheduleServices: bulkCreateScheduleServices,
  getScheduleDoctorsServices: getScheduleDoctorsServices,
};
