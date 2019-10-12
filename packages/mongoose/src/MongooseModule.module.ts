import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from "./user/User.module";

console.log(process.env.MONGODB_URI)
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule
  ],
})
export class OrionMongooseModule {}