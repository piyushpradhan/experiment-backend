import { LoginResponseModel } from "@/domain/entities/auth";
import { SQLDatabaseWrapper } from "src/data/interfaces/data-sources/database-wrapper";
import { IGeneralDataSource } from "src/data/interfaces/data-sources/general-data-source";
import { GeneralResponseModel, GeneralRequestModel } from "src/domain/entities/general";

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
    const existingUser = await this.getUserById(uid);

    if (existingUser) {
      const updatedUser = await this.updateUser(uid, name, email);
      return updatedUser;
    } else {
      const newUser = await this.createUser(uid, name, email);
      return newUser;
    }
  }

  async updateUser(uid: string, name: string, email: string): Promise<LoginResponseModel | null> {
    const query = 'UPDATE * users SET name = $2, email = $3 WHERE uid = $1 RETURNING *';
    const values = [uid, name, email];
    const result = await this.db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getUserById(uid: string): Promise<LoginResponseModel | null> {
    const query = 'SELECT * FROM users WHERE uid = $1';
    const values = [uid];
    const result = await this.db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async createUser(uid: string, name: string, email: string): Promise<LoginResponseModel | null> {
    const query = 'INSERT INTO users (uid, name, email) VALUES ($1, $2, $3) RETURNING *';
    const values = [uid, name, email];
    const result = await this.db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  create(_general: GeneralRequestModel): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
