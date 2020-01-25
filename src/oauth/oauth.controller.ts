import { Controller, Post, Req, Res, Query, BadRequestException } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
import { OAuthServerProvider } from "./oauth.service";
import { Request, Response } from "express";
import OAuth2Server = require("oauth2-server");
import { UserDTO } from "../user/dto/User.dto";
import { CurrentUser } from "./decorators/user.decorator";
import { Public } from "./decorators/public.decorator";
import uuid from 'uuid/v4'
import { UserService } from "../user";

@ApiUseTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor (
    private oauth: OAuthServerProvider,
    private userService: UserService,
  ) {}

  @Public()
  @Post('token')
  token (
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const oAuthReq = new OAuth2Server.Request(req)
    const oAuthRes = new OAuth2Server.Response(res)
    this.oauth.server.token(oAuthReq, oAuthRes).then((token) => {
      res.json({
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        expires: Math.floor((token.accessTokenExpiresAt.getTime() - new Date().getTime()) / 1000)
      })
    }).catch(error => {
      res.status(error.status || 500).send(error)
    })
  }

  @Post('exchange')
  async exchange (@Query('type') type:string, @CurrentUser() user:UserDTO) {
    if (type === 'auth_ticket') {
      user.auth_ticket = uuid();
      
      await this.userService.update(user);

      return {
        auth_ticket: user.auth_ticket
      }
    }

    throw new BadRequestException('invalid `type` param!')
  }
}