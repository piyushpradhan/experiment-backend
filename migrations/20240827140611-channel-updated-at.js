'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
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

    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_channel_timestamp_trigger
      AFTER INSERT ON messages
      FOR EACH ROW
      EXECUTE FUNCTION update_channel_last_message_timestamp();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_channel_timestamp_trigger ON messages;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_channel_last_message_timestamp;
    `);
  }
};

