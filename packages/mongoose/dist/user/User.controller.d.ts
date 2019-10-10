import { UserService } from "./User.service";
export declare class UserController {
    private readonly service;
    constructor(service: UserService);
    find(): Promise<import("./User.schema").IUser[]>;
    save(data: any): Promise<import("./User.schema").IUser>;
}
