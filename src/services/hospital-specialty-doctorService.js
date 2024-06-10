const db = require("../models");

let getTestService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Hospital_Specialty_Doctor.findAll();
      console.log("dataTest", data);
      //   if (data && data.length > 0) {
      //     data.map((item) => {
      //       if (item.image) {
      //         item.image = Buffer.from(item.image, "base64").toString("binary");
      //       }
      //       return item;
      //     });
      //   }
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
  getTestService: getTestService,
};
