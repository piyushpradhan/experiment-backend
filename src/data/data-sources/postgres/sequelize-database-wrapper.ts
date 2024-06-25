import { SQLDatabaseWrapper } from "@/data/interfaces/data-sources/database-wrapper";
import { Sequelize } from "sequelize";

export class SequelizeDatabaseWrapper implements SQLDatabaseWrapper {
  private sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  async query(queryString: string): Promise<{ rows: any[]; }> {
    const result = await this.sequelize.query(queryString);
    return { rows: result };
  }
}
