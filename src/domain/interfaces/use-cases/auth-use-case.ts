import { User } from "@/domain/entities/auth";

export interface AuthUseCase {
  login(uid: string, name: string, email: string): Promise<User | null>;
  createUser(name: string, email: string): Promise<User | null>;
  getAllUsers(): Promise<User[] | null>;
}
