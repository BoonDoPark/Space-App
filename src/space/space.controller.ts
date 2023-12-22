import { Body, Controller, Delete, Param, Post, Put, Get, Req, UseGuards } from '@nestjs/common';
import { SpaceService } from './space.service';
import { Space } from './entities/space.entity';
import { AcceptCourseRequestDTO, ResponseSpaceDTO, SpaceDTO, UserNameDTO } from './dto/read.interface';
import { AuthUser } from 'src/auth/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-access.guard';

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
    @UseGuards(JwtAuthGuard)
    async viewspace(@Param('id') id: number, @Req() req: any): Promise<ResponseSpaceDTO> {
        
        /**
         * 게시글을 수정 혹은 삭제를 하기 위해서 
         * 해당 게시글의 UID 를 기준으로, 역여있는 사용자 UID 가 요청한 Payload UID 와 같은지 비교
         */
        return this.spaceService.viewSpace(id ,req.user.sub);
    }

    @Post('userinfo')
    async updateUser(@Body() req: AcceptCourseRequestDTO): Promise<void> {
        await this.spaceService.updateUserInSpace(req.spaceId, req.userId);
    }
    
    // @Post()
    // async createSpace(@Body() req: Space): Promise<void> {
    //     await this.spaceService.createSpace(req);
    // }

    @UseGuards(JwtAuthGuard)
    @Post('insert')
    async insertSpace(@Body() req: Space, @AuthUser('id') id: number): Promise<void> {
        await this.spaceService.createSpace(req, id);
    }

    // @Post('test')
    // async create(@Body() req: Space, @Req() user: UserNameDTO) {
    //     console.log(user);
    //     await this.spaceService.create(req, user);
    // }

    @Put('update/:id')
    async update(@Param('id') id: number, @Body() req: Space): Promise<void> {
        await this.spaceService.updateSpace(id, req);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.spaceService.deleteSpace(id);
    }
}
