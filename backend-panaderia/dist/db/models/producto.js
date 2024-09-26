'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Producto.belongsTo(models.Categoria, { foreignKey: 'category' });
      Producto.hasMany(models.Transacciones, { foreignKey: 'id_product' });
      Producto.hasMany(models.Produccion, { foreignKey: 'product' });
      Producto.hasMany(models.Inventario, { foreignKey: 'id_product' });
    }
  }
  Producto.init({
    name:DataTypes.STRING,
    category: DataTypes.INTEGER,
    brand: DataTypes.STRING,
    price: DataTypes.FLOAT,
    measure_type: DataTypes.STRING,
    stock: DataTypes.DOUBLE,
    production: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'Productos'
  });
  return Producto;
};