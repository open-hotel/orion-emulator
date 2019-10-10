import { Injectable } from "@nestjs/common";
import { ModelService } from "../util/ModelService";
import { IUser } from "./User.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UserService extends ModelService<IUser> {
  constructor (@InjectModel('User') model: Model<IUser>){
    super(model)
  }
}