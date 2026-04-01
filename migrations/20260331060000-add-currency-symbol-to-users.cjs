'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'currencySymbol', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '$',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'currencySymbol');
  },
};
