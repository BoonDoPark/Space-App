import { Body, Controller, Get, NotFoundException, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogoutDTO, loginDTO } from './dto/login.dto';
import { Response } from 'express';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly userService: UserService,
    ) {}
    
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Body() req: loginDTO, @Res({ passthrough: true }) res: Response): Promise<any> {
        return this.authService.login(req.email, req.password, res);
    }

    @Post('test')
    @UseGuards(RefreshAuthGuard)
    async testToken(@Body() testToken: RefreshTokenDTO): Promise<any> {
        return this.authService.refreshAccessToken(testToken);
    }


    @Post('/refresh')
    // @UseGuards(RefreshAuthGuard)
    async refresh(@Body() refreshTokenDTO: RefreshTokenDTO, @Res({passthrough: true}) res: Response): Promise<void> {
        try {
            const newAccessToken = (await this.authService.refreshAccessToken(refreshTokenDTO)).accessToken;
            res.setHeader('Authorization', 'Bearer ' + newAccessToken);
            res.cookie('access_token', newAccessToken, {
                httpOnly: true,
            });
            res.send({newAccessToken});
        } catch (error) {
            throw new UnauthorizedException('invalid refresh token');
        }
    }
    
    @Post('/logout')
    async deleteToken(@Body() logoutDTO: LogoutDTO, @Res({passthrough: true}) res: Response): Promise<void> {
        try {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            await this.authService.removeRefreshToken(logoutDTO.id);
        } catch (error) {
            throw new NotFoundException('로그아웃된 계정입니다.');
        }
    }
}
