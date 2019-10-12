import { ModelService } from "../util/ModelService";
import { IUser } from "./User.schema";
import { Model } from "mongoose";
export declare class UserService extends ModelService<IUser> {
    constructor(model: Model<IUser>);
}
