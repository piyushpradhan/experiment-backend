'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_channel_last_message_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Update the channel's updated_at with the new message's timestamp
        UPDATE channels
        SET updated_at = NEW.timestamp
        WHERE id = NEW.channel_id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_channel_last_message_timestamp;
    `);
  }
};
