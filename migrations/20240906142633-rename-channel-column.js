'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the column 'channelId' to 'channel_id' in the 'messages' table
    await queryInterface.renameColumn('messages', 'channelId', 'channel_id');
  },

  async down(queryInterface, Sequelize) {
    // Revert the column rename if needed
    await queryInterface.renameColumn('messages', 'channel_id', 'channelId');
  }
};

