'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Message.init(
    {
      id: DataTypes.UUID,
      sender: DataTypes.STRING,
      contents: DataTypes.STRING,
      channel_id: DataTypes.UUID,
      timestamp: DataTypes.DATE,
      tagged_message: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'message',
    },
  );
  return Message;
};
