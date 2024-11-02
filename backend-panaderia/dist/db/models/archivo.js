'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Archivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Archivo.hasMany(models.Transacciones, { foreignKey: 'voucher' });
    }
  }
  Archivo.init({
    route: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Archivo',
  });
  return Archivo;
};