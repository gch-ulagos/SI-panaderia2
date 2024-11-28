'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pedidos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      celular: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estado_del_pedido: {
        type: Sequelize.ENUM('pendiente', 'en_proceso', 'completado', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendiente',
      },
      cantidad: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      producto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pedidos');
  },
};
