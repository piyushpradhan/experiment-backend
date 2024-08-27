'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the trigger function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_last_message()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Update the last_message field in the channels table
        UPDATE channels
        SET last_message = NEW.message_text
        WHERE id = NEW.channel_id;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create the trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_update_last_message
      AFTER INSERT ON messages
      FOR EACH ROW
      EXECUTE FUNCTION update_last_message();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_update_last_message ON messages;
    `);

    // Drop the trigger function
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_last_message;
    `);
  },
};
