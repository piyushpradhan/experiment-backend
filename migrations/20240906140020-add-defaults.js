'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure the uuid-ossp extension is enabled
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Alter the 'id' column in the 'users' table to set a default UUID value
    await queryInterface.changeColumn('users', 'uid', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      allowNull: false // Adjust based on your requirements
    });

    // Alter the 'id' column in the 'channels' table to set a default UUID value
    await queryInterface.changeColumn('channels', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      allowNull: false // Adjust based on your requirements
    });

    // Alter the 'id' column in the 'messages' table to set a default UUID value
    await queryInterface.changeColumn('messages', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      allowNull: false // Adjust based on your requirements
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the default value change for 'users' table if needed
    await queryInterface.changeColumn('users', 'uid', {
      type: Sequelize.UUID,
      allowNull: false // Adjust based on your requirements
    });

    // Revert the default value change for 'channels' table if needed
    await queryInterface.changeColumn('channels', 'id', {
      type: Sequelize.UUID,
      allowNull: false // Adjust based on your requirements
    });

    // Revert the default value change for 'messages' table if needed
    await queryInterface.changeColumn('messages', 'id', {
      type: Sequelize.UUID,
      allowNull: false // Adjust based on your requirements
    });
  }
};

