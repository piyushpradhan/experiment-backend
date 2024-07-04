import { LoginResponseModel } from "@/domain/entities/auth";

export interface AuthUseCase {
  login(uid: string, name: string, email: string): Promise<LoginResponseModel | null>;
}
