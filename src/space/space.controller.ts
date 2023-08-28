import { Body, Controller, Delete, Param, Post, Put, Get, Req, UseGuards } from '@nestjs/common';
import { SpaceService } from './space.service';
import { Space } from './entities/space.entity';
import { JoinSpaceStringDTO } from './dto/update.interface';
import { AcceptCourseRequestDTO, ResponseSpaceDTO, SpaceDTO, UserNameDTO } from './dto/read.interface';
import { UserMapppingSpace } from './entities/userMappingSpace.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthGuards } from 'src/auth/guards/auth.guard';
import { AuthUser } from 'src/auth/user.decorator';

@Controller('space')
export class SpaceController {
    constructor(
        private spaceService: SpaceService,
    ) {}

    @Get('/fetchList')
    async findAll(): Promise<SpaceDTO[]> {
        return await this.spaceService.findAll();
    }
    // 게시글 UID 
    @Get(':id')
    async viewpace(@Param('id') id: number): Promise<ResponseSpaceDTO> {
        
        /**
         * 게시글을 수정 혹은 삭제를 하기 위해서 
         * 해당 게시글의 UID 를 기준으로, 역여있는 사용자 UID 가 요청한 Payload UID 와 같은지 비교
         */
        
        return this.spaceService.viewSpace(id);
    }

    @Post('userinfo')
    async updateUser(@Body() req: AcceptCourseRequestDTO): Promise<void> {
        await this.spaceService.updateUserInSpace(req.spaceId, req.userId);
    }
    
    @Post()
    async createSpace(@Body() req: Space): Promise<void> {
        await this.spaceService.createSpace(req);
    }

    @UseGuards(AuthGuards)
    @Post('insert')
    async insertSpace(@Body() req: Space, @AuthUser('id') id: number): Promise<void> {
        console.log('---------------')
        console.log(id);
        console.log(req);
        await this.spaceService.insertSpace(req, id);
    }

    @Post('test')
    async create(@Body() req: Space, @Req() user: UserNameDTO) {
        console.log(user);
        await this.spaceService.create(req, user);
    }

    @Put('update/:id')
    async update(@Param('id') id: number, @Body() req: Space): Promise<void> {
        await this.spaceService.updateSpace(id, req);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.spaceService.deleteSpace(id);
    }
}
