import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { Payload } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { UserDTO } from 'src/user/dto/read-dto.interface';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }
    
    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({email: email});
        if (!user) {
            throw new NotFoundException(`Not found ${email}`);
        }
        return user;
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.findOneByEmail(email);
        const match = await bcrypt.compare(pass, user.password);
        if (user && match) {
            const { password, ...result } = user;
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
            expiresIn: '30m',
        });
    }

    async getRefreshToken(user: User): Promise<string> {
        const payload: Payload = {
            sub: user.id,
            email: user.email
        }
        return this.jwtService.sign(payload, {
            secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`,
            expiresIn: '7d',
        });
    }

    async setRefreshToken(id: number, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(id, {
            refreshToken: hashedRefreshToken,
        });
    }

    async login(email: string, pass: string): Promise<any> {
        const user = await this.validateUser(email, pass);
        const access_token = await this.getAccessToken(user);
        const refresh_token = await this.getRefreshToken(user);
        await this.setRefreshToken(user.id, refresh_token);

        return {
            access_token,
            refresh_token,
        };
    }

    async isMachedRefreshToken(refreshToken: string): Promise<UserDTO> {
        const { email, ...result } = await this.jwtService.verify(refreshToken, { secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}` });
        if (!email) {
            throw new BadRequestException();
        }

        const user = await this.findOneByEmail(email);
        const isRefreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (isRefreshTokenMatches) {
            return user;
        }
        return null;
    }

    async removeRefreshToken(id: number, res: Response): Promise<void> {
        res.clearCookie('refresh_token');
        res.clearCookie('access_token');
        await this.userRepository.update(id, {
            refreshToken: null,
        });
    }
}
