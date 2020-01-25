import { Injectable } from '@nestjs/common';
import OAuth2Server from 'oauth2-server';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user';

const client = {
  id: process.env.OAUTH_CLIENT_ID,
  grants: ['refresh_token', 'password'],
  accessTokenLifetime: Number(process.env.OAUTH_ACCESS_TOKEN_LIFETIME),
  refreshTokenLifetime: Number(process.env.OAUTH_REFRESH_TOKEN_LIFETIME),
};

@Injectable()
export class OAuthServerProvider
  implements OAuth2Server.PasswordModel, OAuth2Server.RefreshTokenModel {
  server: OAuth2Server = new OAuth2Server({
    model: this,
  });

  constructor(public jwt: JwtService, public usuarioService: UserService) {}

  async validateScope(
    user: OAuth2Server.User,
    client: OAuth2Server.Client,
    scope: string | string[],
  ): Promise<string | string[] | false> {
    return scope;
    // scope = Array.isArray(scope) ? scope : scope.split(',');
    // scope = scope.filter(s => user.permissoes.includes(s));

    // return scope.length > 0 ? scope : false;
  }

  async verifyScope(
    token: OAuth2Server.Token,
    scope: string | string[],
  ): Promise<boolean> {
    return true;
    // if (token.user.permissoes.includes('root')) return true;

    // scope = Array.isArray(scope) ? scope : scope.split(',');
    // const tokenScope = Array.isArray(token.scope)
    //   ? token.scope
    //   : token.scope.split(',');

    // return scope.some(t => tokenScope.includes(t));
  }

  generateRefreshToken(
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    scope: string | string[],
  ): Promise<string> {
    return this.jwt.signAsync(
      {
        sub: user._key,
        aud: client.id,
        scope: Array.isArray(scope) ? scope.join(',') : scope,
      },
      {
        expiresIn: client.refreshTokenLifetime,
      },
    );
  }

  generateAccessToken(
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    scope: string | string[],
  ): Promise<string> {
    return this.jwt.signAsync(
      {
        sub: user.id,
        aud: client.id,
        scope: Array.isArray(scope) ? scope.join(',') : scope,
      },
      {
        expiresIn: client.accessTokenLifetime,
      },
    );
  }

  async getUser(
    username: string,
    password: string,
  ): Promise<OAuth2Server.User> {
    return this.usuarioService.findByUsernameAndPassword(username, password);
  }

  async getRefreshToken(
    refreshToken: string,
  ): Promise<OAuth2Server.RefreshToken> {
    const payload = await this.jwt.verifyAsync(refreshToken).catch(e => {
      throw new OAuth2Server.UnauthorizedRequestError('Invalid RefreshToken', {
        name: 'invalid_refresh_token',
      });
    });

    return {
      client,
      refreshToken,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
      user: await this.usuarioService.getByKey(payload.sub),
    };
  }

  async revokeToken(
    token: OAuth2Server.Token | OAuth2Server.RefreshToken,
  ): Promise<boolean> {
    return true;
  }

  async getClient(
    clientId: string,
    clientSecret: string,
  ): Promise<OAuth2Server.Client> {
    if (
      clientId === client.id &&
      clientSecret === process.env.OAUTH_CLIENT_SECRET
    ) {
      return client;
    }

    return null;
  }

  async saveToken(
    token: OAuth2Server.Token,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.Token> {
    return {
      accessToken: token.accessToken,
      client: client,
      user: user,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
    };
  }

  async getAccessToken(accessToken: string): Promise<OAuth2Server.Token> {
    const payload = await this.jwt.verifyAsync(accessToken).catch(e => {
      throw new OAuth2Server.UnauthorizedRequestError('Invalid AccessToken', {
        name: 'invalid_access_token',
      });
    });

    return {
      client,
      accessToken,
      scope: payload.scope.split(','),
      accessTokenExpiresAt: new Date(payload.exp * 1000),
      user: payload.user,
    };
  }
}
