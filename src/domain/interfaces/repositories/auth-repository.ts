import { User } from "@/domain/entities/auth";

export interface AuthRepository {
  login(uid: string, name: string, email: string): Promise<User | null>;
  createNewUser(name: string, email: string): Promise<User | null>;
  getAllUsers(): Promise<User[] | null>;
}
