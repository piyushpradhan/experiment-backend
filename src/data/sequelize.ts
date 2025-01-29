import { Sequelize } from 'sequelize';
import { PGDataSource } from './data-sources/postgres/postgres-general-data-source';
import { SequelizeDatabaseWrapper } from './data-sources/postgres/sequelize-database-wrapper';
import dotenv from 'dotenv';

dotenv.config();

// export const sequelize: Sequelize = new Sequelize(process.env.DB_URL || 'postgresql://localhost:5432');

export const sequelize: Sequelize = new Sequelize(
  process.env.DB_URL || 'postgresql://postgres:postgres@localhost:5433/showoff',
);

export async function connectPSQL() {
  const sequelizeDbWrapper = new SequelizeDatabaseWrapper(sequelize);
  return new PGDataSource(sequelizeDbWrapper);
}
