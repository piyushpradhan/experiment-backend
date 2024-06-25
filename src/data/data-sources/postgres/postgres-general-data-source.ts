import { SQLDatabaseWrapper } from "src/data/interfaces/data-sources/database-wrapper";
import { GeneralDataSource } from "src/data/interfaces/data-sources/general-data-source";
import { GeneralResponseModel, GeneralRequestModel } from "src/domain/entities/general";

export class PGDataSource implements GeneralDataSource {
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
  create(_general: GeneralRequestModel): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
