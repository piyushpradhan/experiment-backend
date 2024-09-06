'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
  },

  async down (queryInterface, Sequelize) {
    // Drop the trigger function
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_last_message;
    `);
  }
};
