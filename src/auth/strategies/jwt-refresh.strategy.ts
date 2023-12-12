import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "../dto/login.dto";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: `${process.env.REFRESH_TOKEN_SECRET_KEY}`,
        })
    }

    async validate(token: RefreshTokenDTO): Promise<any>{
        const { refresh_token } = token;
        const tokenVerify = await this.jwtService.verify(refresh_token, {secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`});
        // const access_token = await this.authService.getAccessToken()
        return tokenVerify;
    }
}