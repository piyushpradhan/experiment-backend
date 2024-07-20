import { SQLDatabaseWrapper } from "@/data/interfaces/data-sources/database-wrapper";
import { QueryOptions, Sequelize } from "sequelize";

export class SequelizeDatabaseWrapper implements SQLDatabaseWrapper {
  private sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  async query(sql: string, options?: QueryOptions): Promise<{ rows: any[]; }> {
    let result;
    if (options) {
      result = await this.sequelize.query(sql, options);
      return { rows: result };
    }
    result = await this.sequelize.query(sql);
    return { rows: result };
  }
}
