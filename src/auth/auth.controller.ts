import { Body, Controller, Get, NotFoundException, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogoutDTO, loginDTO } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-access.guard';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('login')
    async login(@Body() req: loginDTO, @Res({ passthrough: true }) res: Response): Promise<any> {
        const user = await this.authService.validateUser(req.email, req.password);
        const access_token = await this.authService.getAccessToken(user);
        const refresh_token = await this.authService.getRefreshToken(user);

        await this.authService.setRefreshToken(refresh_token, user.id);

        res.setHeader('Authorization', 'Bearer ' + [access_token, refresh_token]);
        res.cookie('access_token', access_token, {
            httpOnly: true,
        })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
        })
        return {
            access_token: access_token,
            refresh_token: refresh_token,
        }
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: Request, @Res() res: Response): Promise<any> {
        const user = req.user;
        return res.send(user);
    }

    @Post('refresh')
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
            await this.authService.removeRefreshToken(logoutDTO.id);
        } catch (error) {
            throw new NotFoundException('로그아웃된 계정입니다.');
        }
    }
}
