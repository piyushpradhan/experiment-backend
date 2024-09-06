'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Alter the 'created_at' and 'updated_at' columns in the 'channels' table to set default timestamp values
    await queryInterface.changeColumn('channels', 'created_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false // Adjust based on your requirements
    });

    await queryInterface.changeColumn('channels', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false // Adjust based on your requirements
    });

    // Alter the 'created_at' and 'updated_at' columns in the 'messages' table to set default timestamp values
    await queryInterface.changeColumn('messages', 'created_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false // Adjust based on your requirements
    });

    await queryInterface.changeColumn('messages', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false // Adjust based on your requirements
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the default value changes for 'created_at' and 'updated_at' columns if needed
    await queryInterface.changeColumn('channels', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false // Adjust based on your requirements
    });

    await queryInterface.changeColumn('channels', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false // Adjust based on your requirements
    });

    await queryInterface.changeColumn('messages', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false // Adjust based on your requirements
    });

    await queryInterface.changeColumn('messages', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false // Adjust based on your requirements
    });
  }
};

