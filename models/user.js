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
    // Add other fields as necessary
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
