import Message from "../../models/message";
import { LoginResponseModel } from "@/domain/entities/auth";
import { Message as MessageRequest } from "@/domain/entities/message";
import { SQLDatabaseWrapper } from "src/data/interfaces/data-sources/database-wrapper";
import { IGeneralDataSource } from "src/data/interfaces/data-sources/general-data-source";
import { GeneralResponseModel } from "src/domain/entities/general";

export class PGDataSource implements IGeneralDataSource {
  private db: SQLDatabaseWrapper;
  constructor(db: SQLDatabaseWrapper) {
    this.db = db;
  }

  async getAll(): Promise<GeneralResponseModel[] | null> {
    try {
      const query = "SELECT * from users;";
      const result = await this.db.query(query);
      return result.rows.length > 0 ? result.rows : [];
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createOrUpdateUser(uid: string, name: string, email: string): Promise<LoginResponseModel | null> {
    try {
      const existingUser = await this.getUserById(uid);

      if (existingUser) {
        const updatedUser = await this.updateUser(uid, name, email);
        return updatedUser;
      } else {
        const newUser = await this.createUser(uid, name, email);
        return newUser;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateUser(uid: string, name: string, email: string): Promise<LoginResponseModel | null> {
    try {
      const query = 'UPDATE * users SET name = :name, email = :email WHERE uid = :uid RETURNING *';
      const result = await this.db.query(query, {
        replacements: {
          uid,
          name,
          email
        }
      });
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getUserById(uid: string): Promise<LoginResponseModel | null> {
    try {
      const query = 'SELECT * FROM users WHERE uid = ?';
      const result = await this.db.query(query, {
        replacements: { uid }
      });
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createUser(uid: string, name: string, email: string): Promise<LoginResponseModel | null> {
    try {
      const query = 'INSERT INTO users (uid, name, email) VALUES (:uid, :name, :email) RETURNING *';
      const result = await this.db.query(query, {
        replacements: {
          uid,
          name,
          email
        }
      });
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async sendMessage(message: Omit<MessageRequest, "id">): Promise<void> {
    try {
      const query = 'INSERT INTO messages (sender, channelId, contents) VALUES (:sender, :channelId, :contents)';
      await this.db.query(query, {
        replacements: {
          ...message
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteMessage(channelId: string, sender: string): Promise<void> {
    try {
      const query = 'DELETE FROM messages WHERE sender = :sender AND channelId = :channelId';
      await this.db.query(query, {
        replacements: {
          sender,
          channelId
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getChannelMessages(channelId: string): Promise<Message[] | null> {
    try {
      // Reverse order and limit to 30 messages
      const query = 'SELECT * from messages WHERE channelId = :channelId ORDER BY timestamp ASC';
      const result = await this.db.query(query, {
        replacements: { channelId }
      });
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      return null;
    }
  }
}
