import { injectable } from "inversify";
import { UpdateResult } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Bids } from "../entities/Bids";
import { CounterBid } from "../entities/CounterBids";

const BidRepository = AppDataSource.getRepository(Bids);
const CounterBidRepository = AppDataSource.getRepository(CounterBid);

@injectable()
export class BidService {
  private bidRepository = BidRepository;
  private counterBidRepository = CounterBidRepository;

  async findByHouseId(id: number): Promise<Bids[]> {
    return await this.bidRepository
      .createQueryBuilder("bids")
      .where("bids.house = :id", { id })
      .innerJoinAndSelect("bids.counter_bids", "counter_bids")
      .select(["bids", "counter_bids"])
      .getMany();
  }

  async findOne(id: number): Promise<Bids | null> {
    return await this.bidRepository
      .createQueryBuilder("bids")
      .where("bids.id = :id", { id })
      .innerJoinAndSelect("bids.house", "house")
      .innerJoinAndSelect("house.user", "house_user")
      .innerJoinAndSelect("bids.sender", "sender")
      .select([
        "bids",
        "house.id",
        "house.title",
        "house_user.id",
        "house_user.first_name",
        "house_user.last_name",
        "house_user.email",
        "sender.id",
        "sender.first_name",
        "sender.last_name",
        "sender.email",
        "sender.profile_picture",
        "sender.role",
      ])
      .getOne();
  }

  async createBid(bid: Bids): Promise<Bids> {
    const newBid = this.bidRepository.create(bid);
    return await this.bidRepository.save(newBid);
  }

  async createCounterBid(bid: Bids): Promise<CounterBid> {
    const newBid = this.counterBidRepository.create(bid);
    return await this.counterBidRepository.save(newBid);
  }

  async updateBidStatus(id: number, status: string): Promise<UpdateResult> {
    return await this.bidRepository.update(id, {
      status: status,
    });
  }
  async updateCounterBidStatus(
    id: number,
    status: string
  ): Promise<UpdateResult> {
    return await this.counterBidRepository.update(id, {
      status: status,
    });
  }
}
