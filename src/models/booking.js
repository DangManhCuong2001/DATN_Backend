"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Allcode, { foreignKey: "timeType" });
      Booking.belongsTo(models.User, { foreignKey: "doctorId" });
      Booking.hasOne(models.RatePoint, { foreignKey: "appointmentId" });
      Booking.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
    }
  }
  Booking.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      statusId: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
      hospitalId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      fullName: DataTypes.STRING,
      reason: DataTypes.STRING,
      dateOfBirth: DataTypes.STRING,
      gender: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
