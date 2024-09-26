'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produccion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Produccion.belongsTo(models.Producto, { foreignKey: 'product' });
    }
  }
  Produccion.init({
    product: DataTypes.INTEGER,
    measure_type: DataTypes.STRING,
    quantity: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Produccion',
  });
  return Produccion;
};