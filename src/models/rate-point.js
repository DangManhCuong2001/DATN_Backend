"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RatePoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RatePoint.belongsTo(models.Booking, { foreignKey: "appointmentId" });
      RatePoint.belongsTo(models.User, { foreignKey: "userId" });
      RatePoint.belongsTo(models.Doctor_Info, { foreignKey: "doctorId" });
    }
  }
  RatePoint.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      appointmentId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      point: DataTypes.INTEGER,
      rateContent: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RatePoint",
    }
  );
  return RatePoint;
};
