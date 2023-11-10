import { injectable } from "inversify";
import { AppDataSource } from "../db/data-source";
import { House } from "../entities/House";

const HouseRepository = AppDataSource.getRepository(House);

@injectable()
export class HouseService {
  private houseRepository = HouseRepository;

  async findAll(): Promise<House[]> {
    return await this.houseRepository
      .createQueryBuilder("house")
      .innerJoinAndSelect("house.user", "user")
      .select([
        "house",
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "user.profile_picture",
        "user.role",
      ])
      .getMany();
  }

  async findOne(id: number): Promise<House | null> {
    return await this.houseRepository
      .createQueryBuilder("house")
      .where("house.id = :id", { id })
      .innerJoinAndSelect("house.user", "user")
      .select([
        "house",
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "user.profile_picture",
        "user.role",
      ])
      .getOne();
  }

  async createHouse(house: House): Promise<House> {
    const newHouse = this.houseRepository.create(house);
    return await this.houseRepository.save(newHouse);
  }
}
