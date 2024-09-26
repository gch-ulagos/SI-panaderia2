'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inventario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Inventario.belongsTo(models.Producto, { foreignKey: 'id_product' });
    }
  }
  Inventario.init({
    id_product: DataTypes.INTEGER,
    source: DataTypes.STRING,
    stock: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Inventario',
  });
  return Inventario;
};