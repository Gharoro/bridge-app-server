import { Container } from "inversify";
import UserController from "./controllers/user.controller";

const container = new Container();

// Bind controllers
const controllers = [UserController];
controllers.forEach((controller) => container.bind(controller).toSelf());

export default container;
