const db = require("../models");

let getAllSpecialtyService = () => {
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

let createNewSpecialtyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name
        // ||
        // !data.image
        // ||
        // !data.descriptionHTML ||
        // !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        await db.Specialty.create({
          id: data.id,
          name: data.name,
          image: data.image,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
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

let getListSpecialtybyHospitalService = (hospitalId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // let data = await db.Doctor_Info.findAll({
      //   where: { clinicId: hospitalId },
      //   include: [
      //     {
      //       model: db.Specialty,
      //       attributes: ["id", "name"],
      //     },
      //   ],
      // });
      const data = await db.Specialty.findAll({
        include: [
          {
            model: db.Doctor_Info,
            where: { clinicId: hospitalId },
            attributes: [], // Để chỉ lấy dữ liệu từ bảng Specialty
          },
        ],
      });
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
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllSpecialtyService: getAllSpecialtyService,
  createNewSpecialtyService: createNewSpecialtyService,
  getListSpecialtybyHospitalService: getListSpecialtybyHospitalService,
};
