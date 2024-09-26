'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Productos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categoria',
          key: 'id',
        },
        onUpdate: 'CASCADE',
      },
      brand: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      measure_type: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.DOUBLE
      },
      production: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Productos');
  }
};