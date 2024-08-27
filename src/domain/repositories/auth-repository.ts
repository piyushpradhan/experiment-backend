import { PGDataSource } from "@/data/data-sources/postgres/postgres-general-data-source";
import { AuthRepository } from "../interfaces/repositories/auth-repository";
import { User } from "@/domain/entities/auth";

export class AuthRepositoryImpl implements AuthRepository {
  pgDataSource: PGDataSource
  constructor(pgDataSource: PGDataSource) {
    this.pgDataSource = pgDataSource;
  }

  async login(uid: string, name: string, email: string): Promise<User | null> {
    try {
      const existingUser = await this.pgDataSource.updateUser(uid, name, email);

      if (existingUser) {
        const updatedUser = await this.pgDataSource.updateUser(uid, name, email);
        return updatedUser;
      } else {
        const newUser = await this.pgDataSource.createUser(name, email);
        return newUser;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createNewUser(name: string, email: string): Promise<User | null> {
    try {
      const createdUser = await this.pgDataSource.createOrUpdateUser(name, email);
      return createdUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAllUsers(): Promise<User[] | null> {
    try {
      const allUsers = await this.pgDataSource.getAllUsers();
      return allUsers;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
