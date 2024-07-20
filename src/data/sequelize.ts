import { Sequelize } from "sequelize";
import { PGDataSource } from "./data-sources/postgres/postgres-general-data-source";
import { SequelizeDatabaseWrapper } from "./data-sources/postgres/sequelize-database-wrapper";
import dotenv from "dotenv";

dotenv.config();

export const sequelize: Sequelize = new Sequelize(process.env.DB_URL || 'postgresql://localhost:5432');

export async function connectPSQL() {
  const sequelizeDbWrapper = new SequelizeDatabaseWrapper(sequelize);
  return new PGDataSource(sequelizeDbWrapper);
}
