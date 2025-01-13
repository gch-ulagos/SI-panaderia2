'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transacciones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transacciones.belongsTo(models.Producto, {
        foreignKey: 'id_product',
        as: 'product',
      });
      /*Transacciones.belongsTo(models.Archivo, { foreignKey: 'voucher' });*/
    }
  }
  Transacciones.init({
    id_product: DataTypes.INTEGER,
    id_transactions: DataTypes.INTEGER,
    measure_type: DataTypes.STRING,
    transaction_type: DataTypes.STRING,
    price: DataTypes.FLOAT,
    quantity: DataTypes.DOUBLE,
    voucher: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transacciones',
  });
  return Transacciones;
};