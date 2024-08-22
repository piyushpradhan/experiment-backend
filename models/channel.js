'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Channel.init({
    id: DataTypes.UUID,
    name: DataTypes.STRING,
    updatedat: DataTypes.DATE,
    createdat: DataTypes.DATE,
    last_message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'channel',
  });
  return Channel;
};
