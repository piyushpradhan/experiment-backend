import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import User from "./user";

class Message extends Model { }

Message.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'uid'
    }
  },
  contents: {
    type: DataTypes.STRING,
  },
  channelId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: new Date()
  },
  taggedMessage: {
    type: DataTypes.UUID,
    defaultValue: null,
    allowNull: true,
    references: {
      model: 'Messages',
      key: 'id'
    },
    onDelete: 'SET NULL'
  }
}, {
  sequelize,
  modelName: 'Message'
});

Message.hasMany(Message, {
  as: 'Replies',
  foreignKey: 'taggedMessage'
});

Message.belongsTo(Message, {
  as: 'RepliedMessage',
  foreignKey: 'taggedMessage'
});

export default Message;
