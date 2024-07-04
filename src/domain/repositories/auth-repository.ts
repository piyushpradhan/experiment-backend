import { PGDataSource } from "@/data/data-sources/postgres/postgres-general-data-source";
import { AuthRepository } from "../interfaces/repositories/auth-repository";
import { LoginResponseModel } from "../entities/auth";

export class AuthRepositoryImpl implements AuthRepository {
  pgDataSource: PGDataSource
  constructor(pgDataSource: PGDataSource) {
    this.pgDataSource = pgDataSource;
  }

  async login(uid: string, name: string, email: string): Promise<LoginResponseModel | null> {
    try {
      const existingUser = await this.pgDataSource.updateUser(uid, name, email);

      if (existingUser) {
        const updatedUser = await this.pgDataSource.updateUser(uid, name, email);
        return updatedUser;
      } else {
        const newUser = await this.pgDataSource.createUser(uid, name, email);
        return newUser;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
