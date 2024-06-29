"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Hospital.hasOne(models.Markdown, { foreignKey: "clinicId" });
      Hospital.hasMany(models.Doctor_Info, { foreignKey: "clinicId" });
      // Hospital.belongsToMany(models.Specialty, {
      //   through: HospitalSpecialty,
      //   foreignKey: "hospitalId",
      // });
    }
  }
  Hospital.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      address: DataTypes.STRING,
      descriptionHTML: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT,
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Hospital",
    }
  );
  return Hospital;
};
