import { Controller, Post, Req, Res } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
import { OauthService } from "./oauth.service";
import { Request, Response } from "express";
import OAuth2Server = require("oauth2-server");

@ApiUseTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor (
    private oauth: OauthService
  ) {}

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
      res.send(error)
    })
  }
}