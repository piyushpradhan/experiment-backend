import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../sequelize";

class User extends Model { }

User.init({
  uid: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'User',
});

export default User;
