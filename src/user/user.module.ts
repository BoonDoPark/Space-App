import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Board } from './entities/board.entity';
import { UserMapppingSpace } from 'src/space/entities/userMappingSpace.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Board, UserMapppingSpace])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
