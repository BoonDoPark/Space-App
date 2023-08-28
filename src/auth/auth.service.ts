import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { Payload } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardDTO, BoardToUserDTO } from 'src/user/dto/read-dto.interface';
import { Board } from 'src/user/entities/board.entity';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Board) private boardRepository: Repository<Board>,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(email);
        const match = await bcrypt.compare(pass, user.password);
        if (!user || !match) {
            throw new UnauthorizedException();
        }
        const { password, ...data} = user;
        return data;
    }

    async getAccessToken(user: User): Promise<string> {
        const payload: Payload = {
            id: user.id,
            email: user.email
        }
        return this.jwtService.signAsync(payload, {
            secret: `${process.env.ACCESS_TOKEN_SECRET_KEY}`,
            expiresIn: '15m',
        });
    }

    async getRefreshToken(user: User): Promise<string> {
        const payload: Payload = {
            id: user.id,
            email: user.email
        }
        return this.jwtService.signAsync(
            {id: payload.id},
                {
                    secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`,
                    expiresIn: '2d',
                });
    }

    async setRefreshToken(refreshToken: string, id: number): Promise<void> {
        await this.userRepository.update(id, {
            refreshToken: refreshToken,
        })
    }

    async profile(payload: Payload): Promise<BoardToUserDTO> {
        const user = await this.userRepository.findOneBy({id: payload.id});
        if (!user) {
            throw new NotFoundException(`Not found ${payload.id}`);
        }
        const boardAll: BoardDTO[] = await this.boardRepository.find({ 
            relations: {
                user: true,
            },
            where: {
                user: {
                    id: user.id,
                }
            }});

        const parseBoardAll = boardAll.map((v) => {
            return {
                id: v.id,
                title: v.title,
                content: v.content
            }
        })
        return {
            user: {
                id: user.id,
                email: user.email,
                nickName: user.nickName,
                userSex: user.userSex,
                profile: user.profile
            },
            board: parseBoardAll
        }
    }

    async refreshAccessToken(refreshTokenDTO: RefreshTokenDTO): Promise<{ accessToken: string }> {
        const { refresh_token } = refreshTokenDTO;
        const decodedRefreshToken = this.jwtService.verify(refresh_token, { secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`} ) as Payload;
        const user = await this.userService.findOne(decodedRefreshToken.email);
        if (!user) {
            throw new UnauthorizedException('not found user');
        }

        const accessToken = await this.getAccessToken(user);

        return {accessToken};
    }

    async removeRefreshToken(id: number): Promise<any> {
        return await this.userRepository.update(id, {
            refreshToken: null,
        });
    }
}
