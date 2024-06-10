"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hospital_Specialty_Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Hospital_Specialty_Doctor.hasMany(models.Specialty, { foreignKey: "id" });
      //   Hospital_Specialty_Doctor.hasMany(models.User, { foreignKey: "gender" });
    }
  }
  Hospital_Specialty_Doctor.init(
    {
      hospitalId: DataTypes.STRING,
      specialtyId: DataTypes.STRING,
      doctorId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Hospital_Specialty_Doctor",
    }
  );
  return Hospital_Specialty_Doctor;
};
