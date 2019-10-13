import { Module } from "@nestjs/common";
import { BannerProvider } from "./Banner.provider";

@Module({
  providers: [BannerProvider]
})
export class BannerModule {}