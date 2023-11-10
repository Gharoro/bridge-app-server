import { injectable } from "inversify";
import { AppDataSource } from "../db/data-source";
import { Transaction } from "../entities/Transaction";

const TransactionRepository = AppDataSource.getRepository(Transaction);

@injectable()
export class TransactionService {
  private transactionRepository = TransactionRepository;

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(transaction);
    return await this.transactionRepository.save(newTransaction);
  }

  async findByLandlordId(id: number): Promise<Transaction[]> {
    return await this.transactionRepository
      .createQueryBuilder("transaction")
      .innerJoinAndSelect("transaction.bid", "bid")
      .innerJoinAndSelect("bid.house", "house")
      .innerJoinAndSelect("bid.sender", "sender")
      .innerJoinAndSelect("house.user", "user")
      .where("user.id = :id", { id })
      .select([
        "transaction",
        "bid",
        "house",
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "user.profile_picture",
        "sender.id",
        "sender.first_name",
        "sender.last_name",
        "sender.email",
        "sender.profile_picture",
      ])
      .getMany();
  }
  async findByTenantId(id: number): Promise<Transaction[]> {
    return await this.transactionRepository
      .createQueryBuilder("transaction")
      .innerJoinAndSelect("transaction.bid", "bid")
      .innerJoinAndSelect("bid.house", "house")
      .innerJoinAndSelect("bid.sender", "sender")
      .innerJoinAndSelect("house.user", "user")
      .where("sender.id = :id", { id })
      .select([
        "transaction",
        "bid",
        "house",
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "user.profile_picture",
        "sender.id",
        "sender.first_name",
        "sender.last_name",
        "sender.email",
        "sender.profile_picture",
      ])
      .getMany();
  }
}
