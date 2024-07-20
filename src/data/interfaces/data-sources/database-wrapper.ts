import * as sequelize from "sequelize";

export interface SQLDatabaseWrapper {
  query(sql: string, options?: sequelize.QueryOptions): Promise<{ rows: any[] }>;
}
