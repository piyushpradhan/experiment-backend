import { LoginResponseModel } from "../entities/auth";
import { AuthRepository } from "../interfaces/repositories/auth-repository";
import { AuthUseCase } from "../interfaces/use-cases/auth-use-case";

export class AuthUseCaseImpl implements AuthUseCase {
  authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async login(uid: string, name: string, email: string): Promise<LoginResponseModel | null> {
    try {
      const userDetails = await this.authRepository.login(uid, name, email);
      return userDetails;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

}
