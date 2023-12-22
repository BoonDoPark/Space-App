import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "../dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth.service";
import { Request } from "express";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors(
                [
                    (request) => {
                        return request?.cookies?.refresh_token;
                    }
            ]
        ),
            ignoreExpiration: false,
            secretOrKey: `${process.env.REFRESH_TOKEN_SECRET_KEY}`,
            passReqToCallback: true
        })
    }

    async validate(req: Request) {
        const refresh_token = req.cookies?.refresh_token;
        return this.authService.isMachedRefreshToken(refresh_token);
    }
}