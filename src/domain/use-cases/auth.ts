import { User } from "../entities/auth";
import { AuthRepository } from "../interfaces/repositories/auth-repository";
import { AuthUseCase } from "../interfaces/use-cases/auth-use-case";

export class AuthUseCaseImpl implements AuthUseCase {
  authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async login(uid: string, name: string, email: string): Promise<User | null> {
    try {
      const userDetails = await this.authRepository.login(uid, name, email);
      return userDetails;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createUser(name: string, email: string): Promise<User | null> {
    try {
      const createdUser = await this.authRepository.createNewUser(name, email);
      return createdUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAllUsers(): Promise<User[] | null> {
    try {
      const allUsers = await this.authRepository.getAllUsers();
      return allUsers;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
