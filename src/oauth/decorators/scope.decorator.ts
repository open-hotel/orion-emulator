import { ApiOAuth2Auth } from "@nestjs/swagger";
import { SetMetadata } from "@nestjs/common";

export function OAuthScopes(scopes:string[]) {
  return function (target:object, key?:string|symbol, descriptor?: TypedPropertyDescriptor<any>) {
    SetMetadata('OAUTH_SCOPES', scopes)(target, key, descriptor)
    ApiOAuth2Auth(scopes)(target, key, descriptor)
  }
}