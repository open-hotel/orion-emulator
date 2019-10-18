import { Injectable } from '@nestjs/common';
import OAuth2Server from 'oauth2-server'
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/dto/User.dto';
import { UserService } from '../user';

@Injectable()
export class OauthService implements OAuth2Server.PasswordModel, OAuth2Server.RefreshTokenModel {
    constructor (
        private jwtService: JwtService,
        private userService: UserService
    )
    {}
    async getRefreshToken(refreshToken: string): Promise<false> {
        return false
    }
    revokeToken(token: OAuth2Server.RefreshToken): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getUser(username: string, password: string): Promise<UserDTO> {
        throw new Error("Method not implemented.");
    }
    async generateAccessToken?(client:OAuth2Server.Client, user: OAuth2Server.User, scope: string | string[],  ): Promise<string> {
        return this.jwtService.sign({
            sub: user._key,
            email: user.account.email,
            username: user.account.username
        })
    }
    async getClient(clientId: string, clientSecret: string): Promise<OAuth2Server.Client | false> {
        const user = await this.userService.filterBy('account.oauth.client.id', clientId)
        if (clientSecret !== user.account.password) {
            return false
        }
        return user.account.oauth.client
    }
    async saveToken(token: OAuth2Server.Token, client: OAuth2Server.Client, user: UserDTO ): Promise<OAuth2Server.Token> {
        const { oauth } = user.account
        oauth.access_token = token.accessToken
        oauth.refresh_token = token.refreshToken
        oauth.access_token_expire_timestamp = token.accessTokenExpiresAt.getTime()
        oauth.refresh_token_expire_timestamp = token.refreshTokenExpiresAt.getTime()
        oauth.client = {
            ...client,
            secret: ''
        }
        await this.userService.update(user)
        return token
    }
    getAccessToken(accessToken: string, ): Promise<false | "" | 0 | OAuth2Server.Token> {
        throw new Error("Method not implemented.");
    }
    async verifyScope(token: OAuth2Server.Token, scope: string | string[], ): Promise<boolean> {
        return true
    }
    public readonly server = new OAuth2Server({
        model: this
    })

    
}
