'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    static associate(models) {

    }
  }
  Pedido.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, 
      primaryKey: true, 
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, 
      },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    celular: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: true, 
      },
    },
    estado_del_pedido: {
      type: DataTypes.ENUM('pendiente', 'en_proceso', 'completado', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente', 
    },
    cantidad: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isFloat: true, 
        min: 0.1, 
      },
    },
    producto: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, 
      },
    },
  }, {
    sequelize,
    modelName: 'Pedido',
  });

  return Pedido;
};
