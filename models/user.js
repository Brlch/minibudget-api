import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {}

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {   // Note: Always hash passwords, never store in plain text
      type: DataTypes.STRING,
      allowNull: false
    },
    dailyBudget: {
      type: DataTypes.DECIMAL(10, 2),  // DECIMAL type to store currency values
      allowNull: true,  // Allow NULL in case some users don't set it immediately
      defaultValue: null,  // Default value can be set if necessary
      comment: 'Recommended daily budget amount for the user'
    },
    // Add other fields as necessary
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
