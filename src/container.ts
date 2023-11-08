import { Container } from "inversify";
import UserController from "./controllers/user.controller";
import { UserService } from "./services/user.service";

const container = new Container();

// Bind controllers
const controllers = [UserController];
controllers.forEach((controller) => container.bind(controller).toSelf());

// Bind services
const services = [UserService];
services.forEach((service) => container.bind(service).toSelf());

export default container;
