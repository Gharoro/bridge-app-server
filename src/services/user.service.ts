import { injectable } from "inversify";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User";

const UserRepository = AppDataSource.getRepository(User);

@injectable()
export class UserService {
  private userRepository = UserRepository;

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
