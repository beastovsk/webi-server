'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CreateShop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CreateShop.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  CreateShop.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    companyEmail: DataTypes.STRING,
    companyPhone: DataTypes.STRING,
    address: DataTypes.STRING,
    supportContact: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CreateShop',
  });
  return CreateShop;
};