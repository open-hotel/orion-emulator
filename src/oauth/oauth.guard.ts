import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { OAuthServerProvider } from './oauth.service';
import * as OAuthServer from 'oauth2-server';
import { Request, Response } from 'express';

const getPublic = (value: Function) =>
  Reflect.getMetadata('OAUTH_PUBLIC', value);

const getScopes = (value: Function) =>
  Reflect.getMetadata('OAUTH_SCOPES', value) || [];

@Injectable()
export class OAuthGuard implements CanActivate {
  @Inject(OAuthServerProvider)
  oauth: OAuthServerProvider;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();

    const request: Request = http.getRequest();
    const response: Response = http.getResponse();
    const req = new OAuthServer.Request(request);
    const res = new OAuthServer.Response(response);

    const controller = context.getClass();
    const handler = context.getHandler();
    const isPublic = getPublic(handler) || getPublic(controller);

    if (isPublic) return true;

    let scope = getScopes(controller).concat(getScopes(handler));

    scope = scope.length ? scope.join(',') : [];

    return this.oauth.server
      .authenticate(req, res, { scope: scope.length ? scope : undefined })
      .then(token => {
        response.locals.user = token.user;
        return !!token.user;
      });
  }
}
