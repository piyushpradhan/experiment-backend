import { SQLDatabaseWrapper } from "@/data/interfaces/data-sources/database-wrapper";
import { Sequelize } from "sequelize";

export class SequelizeDatabaseWrapper implements SQLDatabaseWrapper {
  private sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  async query(queryString: string, values?: unknown[]): Promise<{ rows: any[]; }> {
    let result;
    if (values) {
      result = await this.sequelize.query({
        query: queryString,
        values
      });
    }
    result = await this.sequelize.query(queryString);
    return { rows: result };
  }
}
