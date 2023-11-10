import { injectable } from "inversify";
import { UpdateResult } from "typeorm";
import * as bcrypt from "bcrypt";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User);

@injectable()
export class UserService {
  private userRepository = UserRepository;

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async createUser(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findUserBySignupCode(code: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ signup_token: code });
  }

  async confirmUser(user: User): Promise<UpdateResult> {
    return await this.userRepository.update(user.id, {
      email_confirmed: true,
      signup_token: "",
    });
  }

  async authenticateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.findUserByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }

    return null;
  }
}
