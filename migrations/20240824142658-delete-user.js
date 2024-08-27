'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define the special UUID for deleted users
    const deletedUserId = '00000000-0000-0000-0000-000000000000';

    await queryInterface.bulkInsert('users', [{
      uid: deletedUserId,
      name: 'Deleted User',
      email: 'deleted@example.com'
    }], {});

    await queryInterface.sequelize.query(`
      ALTER TABLE messages
      DROP CONSTRAINT IF EXISTS messages_sender_fkey;
      
      ALTER TABLE messages
      ADD CONSTRAINT messages_sender_fkey
      FOREIGN KEY (sender) REFERENCES users(uid)
      ON DELETE SET NULL;
    `);

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION replace_null_with_deleted()
      RETURNS TRIGGER AS $$
      BEGIN
        IF OLD.sender IS NULL THEN
          NEW.sender := '${deletedUserId}';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_replace_null_with_deleted ON messages;

      CREATE TRIGGER trigger_replace_null_with_deleted
      BEFORE UPDATE ON messages
      FOR EACH ROW
      EXECUTE FUNCTION replace_null_with_deleted();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Define the special UUID for deleted users
    const deletedUserId = '00000000-0000-0000-0000-000000000000';

    // Drop the trigger and function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_replace_null_with_deleted ON messages;
      DROP FUNCTION IF EXISTS replace_null_with_deleted;
    `);

    // Restore the original foreign key constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE messages
      DROP CONSTRAINT IF EXISTS messages_sender_fkey;
      
      ALTER TABLE messages
      ADD CONSTRAINT messages_sender_fkey
      FOREIGN KEY (sender) REFERENCES users(uid)
      ON DELETE CASCADE;
    `);

    // Remove the 'deleted' user
    await queryInterface.bulkDelete('users', {
      uid: deletedUserId
    }, {});
  }
};

