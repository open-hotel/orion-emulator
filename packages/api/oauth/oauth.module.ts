import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/User.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        issuer: process.env.JWT_ISSUER
      },
      verifyOptions: {
        issuer: process.env.JWT_ISSUER,
      }
    }),
    UserModule
  ],
  providers: [OauthService]
})
export class OauthModule { }
