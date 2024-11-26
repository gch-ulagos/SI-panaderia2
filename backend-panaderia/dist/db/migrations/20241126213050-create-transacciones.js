'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transacciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_product: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Producto',
          key: 'id',
        }
      },
      id_transactions: {
        type: Sequelize.INTEGER,
      },
      measure_type: {
        type: Sequelize.STRING
      },
      transaction_type: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      quantity: {
        type: Sequelize.DOUBLE
      },
      voucher: {
        type: Sequelize.STRING,
        references: {
          model: 'Archivo',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Transacciones');
  }
};