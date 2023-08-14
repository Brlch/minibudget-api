import { Model, DataTypes } from 'sequelize';

class Transaction extends Model {
  static associate(models) {
    Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

export default function initTransactionModel(sequelize) {
  Transaction.init(
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', 
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      timestamps: true
    }
  );

  return Transaction;
}
