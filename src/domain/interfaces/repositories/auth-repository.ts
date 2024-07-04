import { LoginResponseModel } from "@/domain/entities/auth";

export interface AuthRepository {
  login(uid: string, name: string, email: string): Promise<LoginResponseModel | null>;
}
