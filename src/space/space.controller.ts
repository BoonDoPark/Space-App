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
        return this.spaceService.findSpaces();
    }
    
    // 게시글 UID 
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async viewspace(@Param('id') id: number, @Req() req: any): Promise<ResponseSpaceDTO> {
        
        /**
         * 게시글을 수정 혹은 삭제를 하기 위해서 
         * 해당 게시글의 UID 를 기준으로, 역여있는 사용자 UID 가 요청한 Payload UID 와 같은지 비교
         */
        return this.spaceService.findUsersBySpace(id, req.user.userId);
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async create(@Body() spaceInput: Space, @Req() req: any): Promise<void> {
        await this.spaceService.createSpace(spaceInput, req.user.userId);
    }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Body() req: AcceptCourseRequestDTO): Promise<void> {
        await this.spaceService.addUserInSpace(req.spaceId, req.userId);
    }

    @Put('update/:id')
    async update(@Param('id') id: number, @Body() req: Space): Promise<void> {
        await this.spaceService.updateSpace(id, req);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: number, @Req() req: any): Promise<void> {
        await this.spaceService.deleteUserInSpace(id, req.user.userId);
    }
}
