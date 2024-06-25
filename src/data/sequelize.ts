import { Sequelize } from "sequelize";
import { PGDataSource } from "./data-sources/postgres/postgres-general-data-source";
import { SequelizeDatabaseWrapper } from "./data-sources/postgres/sequelize-database-wrapper";

export const sequelize = new Sequelize('');

export async function connectPSQL() {
  const sequelizeDbWrapper = new SequelizeDatabaseWrapper(sequelize);
  return new PGDataSource(sequelizeDbWrapper);
}
