import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { UserMapppingSpace } from './entities/userMappingSpace.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Space, UserMapppingSpace, User])],
  controllers: [SpaceController],
  providers: [SpaceService, JwtService],
  exports: [SpaceService]
})
export class SpaceModule {}
