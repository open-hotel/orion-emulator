import { Injectable } from '@nestjs/common';
import OAuth2Server from 'oauth2-server';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user';

const client = {
  grants: ['password', 'refresh_token'],
  id: process.env.OAUTH_CLIENT_ID,
  accessTokenLifetime: +process.env.OAUTH_ACCESS_TOKEN_LIFETIME,
  refreshTokenLifetime: +process.env.OAUTH_REFRESH_TOKEN_LIFETIME,
};

@Injectable()
export class OauthService
  implements OAuth2Server.PasswordModel, OAuth2Server.RefreshTokenModel {
  public readonly server: OAuth2Server = new OAuth2Server({
    model: this,
  });

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // TODO: Verificar se o token não está na lista negra
  async getRefreshToken(
    refreshToken: string,
  ): Promise<OAuth2Server.RefreshToken> {
    const payload = this.jwtService.verify(refreshToken);
    return {
      refreshToken: refreshToken,
      refreshTokenExpiresAt: new Date(payload.exp),
      client: client,
      user: {},
    };
  }

  // TODO: Colocar Token na lista negra
  async revokeToken(token: OAuth2Server.RefreshToken): Promise<boolean> {
    return true;
  }

  async generateRefreshToken?(
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    scope: string | string[],
  ): Promise<string> {
    return this.jwtService.sign(
      {
        sub: user._key,
        aud: client.id,
      },
      {
        expiresIn: client.refreshTokenLifetime,
      },
    );
  }

  async getUser(username: string, password: string): Promise<OAuth2Server.User> {
    return this.userService.findByUsernameAndPassword(username, password)
  }

  async generateAccessToken?(
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    scope: string | string[],
  ): Promise<string> {
    return this.jwtService.sign(
      {
        sub: user._key,
        aud: client.id,
        user: {
          key: user._key,
          email: user.account.email,
          username: user.account.username,
        },
      },
      {
        expiresIn: client.accessTokenLifetime,
      },
    );
  }

  // TODO: Retornar clientes OAuth Cadastrados no "Open Habbo API"
  async getClient(
    clientId: string,
    clientSecret: string,
  ): Promise<OAuth2Server.Client> {
    if (
      clientId !== client.id ||
      clientSecret !== process.env.OAUTH_CLIENT_SECRET
    )
      return null;
    return client;
  }

  // TODO: Salvar tokens gerados para ter controle sobre as sessões
  async saveToken(
    token: OAuth2Server.Token,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.Token> {
    return {
      ...token,
      client,
      user,
    };
  }

  async getAccessToken(accessToken: string): Promise<OAuth2Server.Token> {
    const payload = this.jwtService.verify(accessToken);
    return {
      accessToken: accessToken,
      accessTokenExpiresAt: new Date(payload.exp),
      client: client,
      user: payload.user,
    };
  }

  async verifyScope(
    token: OAuth2Server.Token,
    scope: string | string[],
  ): Promise<boolean> {
    return true;
  }
}
