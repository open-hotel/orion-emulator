import { Injectable } from '@nestjs/common';
import * as OAuth2Server from 'oauth2-server'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OauthService implements OAuth2Server.PasswordModel, OAuth2Server.RefreshTokenModel {
    constructor (
        private jwtService: JwtService
    )
    {}
    getRefreshToken(refreshToken: string,  ): Promise<OAuth2Server.RefreshToken> {
        throw new Error("Method not implemented.");
    }
    revokeToken(token: OAuth2Server.RefreshToken): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    generateRefreshToken?(client: OAuth2Server.Client, user: OAuth2Server.User, scope: string | string[]): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getUser(username: string, password: string): Promise<OAuth2Server.User> {
        throw new Error("Method not implemented.");
    }
    async validateScope?(user: OAuth2Server.User, client:OAuth2Server.Client, scope: string[]): Promise<string[]> {
        return []
    }
    async generateAccessToken?(client:OAuth2Server.Client, user: OAuth2Server.User, scope: string | string[],  ): Promise<string> {
        return this.jwtService.sign({
            sub: user._key,
            email: user.account.email,
            username: user.account.username
        })
    }
    getClient(clientId: string, clientSecret: string): Promise<OAuth2Server.Client> {
        throw new Error("Method not implemented.");
    }
    saveToken(token: OAuth2Server.Token, client: OAuth2Server.Client, user: OAuth2Server.User ): Promise<OAuth2Server.Token> {
        throw new Error("Method not implemented.");
    }
    getAccessToken(accessToken: string, ): Promise<false | "" | 0 | OAuth2Server.Token> {
        throw new Error("Method not implemented.");
    }
    verifyScope(token: OAuth2Server.Token, scope: string | string[], ): Promise<boolean> {
        return Promise.resolve(true)
    }
    public readonly server = new OAuth2Server({
        model: this
    })

    
}
