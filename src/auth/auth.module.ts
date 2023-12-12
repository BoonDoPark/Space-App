import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Board } from 'src/user/entities/board.entity';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Board]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, LocalStrategy, JwtStrategy, RefreshStrategy],
  exports: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
