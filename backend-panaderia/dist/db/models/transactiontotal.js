'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionTotal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  TransactionTotal.init({
    id_transaction: DataTypes.INTEGER,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'TransactionTotal',
  });
  return TransactionTotal;
};