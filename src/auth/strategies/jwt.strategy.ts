import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Payload } from "../dto/login.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: `${process.env.ACCESS_TOKEN_SECRET_KEY}`
        })
    }

    async validate(payload: Payload): Promise<any> {
        const user = await this.authService.profile(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}