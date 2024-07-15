import hospital from "../models/hospital";
import db from "../models/index";
require("dotenv").config();

let getTopHospitalHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hospitals = await db.Hospital.findAll({
        limit: limitInput,
        // where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        // attributes: {
        //   exclude: ["password"],
        // },
        raw: true,
        nest: true,
      });
      hospitals.map((item) => {
        item.image = Buffer.from(item.image, "base64").toString("binary");
        return item;
      });

      resolve({
        errCode: 0,
        topHospital: hospitals,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let createNewHospitalService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.image
        // ||
        // !data.descriptionHTML ||
        // !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        await db.Markdown.create({
          contentHTML: data.contentHTML,
          contentMarkdown: data.contentMarkdown,
          description: data.description,
          clinicId: data.id,
        });

        await db.Hospital.create({
          id: data.id,
          name: data.name,
          type: data.type,
          image: data.image,
          address: data.address,
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

let updateHospitalService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing parameter",
        });
      }
      let hospital = await db.Hospital.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (hospital) {
        hospital.id = data.id;
        hospital.name = data.name;
        hospital.type = data.type;
        hospital.address = data.address;
        hospital.image = data.image;
        hospital.descriptionHTML = data.descriptionHTML;
        hospital.descriptionMarkdown = data.descriptionMarkdown;
        await hospital.save();
        resolve({
          errCode: 0,
          message: "Update success",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "hospital not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllHospitalService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Hospital.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errMessage: "ok",
        errCode: 0,
        hospitals: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getHospitalWithTypeService = (typeHospital) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeHospital) {
        resolve({
          errCode: 2,
          errMessage: "Missing parameter",
        });
      } else {
        let hospitals = await db.Hospital.findAll({
          where: { type: typeHospital },
          // order: [["createdAt", "DESC"]],
          // attributes: {
          //   exclude: ["password"],
          // },
          raw: true,
          nest: true,
        });
        hospitals.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });

        resolve({
          errCode: 0,
          hospitalWithType: hospitals,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getInfoHospitalByIdService = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errMessage: "missing parameter!",
          errCode: 1,
        });
      } else {
        let data = await db.Hospital.findOne({
          where: { id: inputId },
          // attributes: ["descriptionHTML", "descriptionMarkdown"],
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
          ],
        });

        if (data) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }

        resolve({
          errMessage: "ok",
          errCode: 0,
          infoHospital: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewHospitalService: createNewHospitalService,
  getAllHospitalService: getAllHospitalService,
  // getInfoHospitalByIdService: getInfoHospitalByIdService
  getTopHospitalHome: getTopHospitalHome,
  updateHospitalService: updateHospitalService,
  getHospitalWithTypeService: getHospitalWithTypeService,
  getInfoHospitalByIdService: getInfoHospitalByIdService,
};
