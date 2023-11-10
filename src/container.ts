import { Container } from "inversify";
import UserController from "./controllers/user.controller";
import HouseController from "./controllers/house.controller";
import { UserService } from "./services/user.service";
import { MailService } from "./services/mail.service";
import { HouseService } from "./services/house.service";
import { UploadService } from "./services/upload.service";
import BidController from "./controllers/bid.controller";
import { BidService } from "./services/bid.service";
import { PaymentService } from "./services/payment.service";
import TransactionController from "./controllers/transaction.controller";
import { TransactionService } from "./services/transaction.service";
import { RedisService } from "./services/redis.service";

const container = new Container();

// Bind controllers
container.bind<UserController>(UserController).toSelf();
container.bind<HouseController>(HouseController).toSelf();
container.bind<BidController>(BidController).toSelf();
container.bind<TransactionController>(TransactionController).toSelf();

// Bind services
container.bind<UserService>(UserService).toSelf();
container.bind<HouseService>(HouseService).toSelf();
container.bind<MailService>(MailService).toSelf();
container.bind<UploadService>(UploadService).toSelf();
container.bind<BidService>(BidService).toSelf();
container.bind<PaymentService>(PaymentService).toSelf();
container.bind<TransactionService>(TransactionService).toSelf();
container.bind<RedisService>(RedisService).toSelf();

export default container;
