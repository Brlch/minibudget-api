'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'dailyBudget', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      comment: 'Recommended daily budget amount for the user'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'dailyBudget');
  }
};
