import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { Payload } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(email);
        const match = await bcrypt.compare(pass, user.password);
        if (user && match) {
            const { password, ...result} = user;
            return result;
        }
        return null;
    }

    async getAccessToken(user: User): Promise<string> {
        const payload: Payload = {
            sub: user.id,
            email: user.email
        }
        return this.jwtService.sign(payload, {
            secret: `${process.env.ACCESS_TOKEN_SECRET_KEY}`,
            expiresIn: '60s',
        });
    }

    async getRefreshToken(user: User): Promise<string> {
        const payload: Payload = {
            sub: user.id,
            email: user.email
        }
        return this.jwtService.sign(payload,{
            secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`,
            expiresIn: '7d',
        });
    }

    async setRefreshToken(id: number, refreshToken: string, res: Response): Promise<void> {
        res.setHeader('Set-Cookie', 'refresh_token=' + refreshToken);
        // res.cookie('refresh_token', refreshToken, {
        //     httpOnly: true,
        // });
        await this.userRepository.update(id, {
            refreshToken: refreshToken,
        });
    }

    async login(email: string, pass: string, res: Response): Promise<any> {
        const user = await this.validateUser(email, pass);
        const access_token = await this.getAccessToken(user);
        const refresh_token = await this.getRefreshToken(user);
        await this.setRefreshToken(user.id, refresh_token, res);
        return res.status(200).send(access_token)
    }

    async refreshAccessToken(refreshTokenDTO: RefreshTokenDTO): Promise<{ accessToken: string }> {
        const { refresh_token } = refreshTokenDTO;
        const decodedRefreshToken = this.jwtService.verify(refresh_token, { secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`}) as Payload;
        const user = await this.userService.findOne(decodedRefreshToken.email);
        if (!user) {
            throw new UnauthorizedException('not found user');
        }

        const accessToken = await this.getAccessToken(user);

        return {accessToken};
    }

    async removeRefreshToken(id: number): Promise<void> {
        await this.userRepository.update(id, {
            refreshToken: null,
        });
    }
}
