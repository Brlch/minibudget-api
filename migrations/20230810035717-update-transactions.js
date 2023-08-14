'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Modify columns
    await queryInterface.changeColumn('transactions', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('transactions', 'amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.changeColumn('transactions', 'type', {
      type: Sequelize.ENUM('income', 'expense'),
      allowNull: false,
    });

    // Add new column
    await queryInterface.addColumn('transactions', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', // table name, not model name
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove added column
    await queryInterface.removeColumn('transactions', 'userId');

    // Revert column changes
    await queryInterface.changeColumn('transactions', 'date', {
      type: Sequelize.DATE,
      allowNull: true, // Modify according to your original migration
    });

    await queryInterface.changeColumn('transactions', 'amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Modify according to your original migration
    });

    await queryInterface.changeColumn('transactions', 'type', {
      type: Sequelize.ENUM('income', 'expense'),
      allowNull: true, // Modify according to your original migration
    });
  },
};
