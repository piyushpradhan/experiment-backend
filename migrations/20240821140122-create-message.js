'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      sender: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // Make sure this matches the table name for the User model
          key: 'uid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      contents: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      channelId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      tagged_message: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'messages',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('messages', {
      fields: ['tagged_message'],
      type: 'foreign key',
      name: 'fk_messages_taggedMessage',
      references: {
        table: 'messages',
        field: 'id',
      },
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  },
};
