import { Body, Controller, Get, NotFoundException, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogoutDTO, loginDTO } from './dto/login.dto';
import { Request, Response } from 'express';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/jwt-refresh.guard';
import { UserDTO } from 'src/user/dto/read-dto.interface';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Body() req: loginDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
        const { access_token, refresh_token } = await this.authService.login(req.email, req.password, res);
        res.setHeader('Authorization', 'Bearer ' + access_token);
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true
        });
        res.send({ access_token })
    }

    @Post('test')
    @UseGuards(RefreshAuthGuard)
    async testToken(@Req() req: any, @Res({ passthrough: true }) res: Response): Promise<any> {
        const {refreshToken, password, ...user} = await req.user;
        const access_token = await this.authService.getAccessToken(user);
        res.setHeader('Authorization', 'Bearer ' + access_token);
        return user;
    }


    @Post('/refresh')
    @UseGuards(RefreshAuthGuard)
    async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response): Promise<void> {
        try {
            const {refreshToken, password, ...user} = await req.user;
            const access_token = await this.authService.getAccessToken(user);
            res.setHeader('Authorization', 'Bearer ' + access_token);
            return user;
        } catch (error) {
            throw new UnauthorizedException('invalid refresh token');
        }
    }

    @Post('/logout')
    @UseGuards(RefreshAuthGuard)
    async deleteToken(@Req() req: any, @Res({ passthrough: true }) res: Response): Promise<void> {
        try {
            await this.authService.removeRefreshToken(req.user.id, res);
        } catch (error) {
            throw new NotFoundException('로그아웃된 계정입니다.');
        }
    }
}
