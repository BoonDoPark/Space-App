import { Controller, Delete, Param, Post, Put, Get, Body, Patch, UseGuards, Req, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { BoardDTO, BoardToUserDTO, UserDTO, UsersDTO } from './dto/read-dto.interface';
import { Board } from './entities/board.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-access.guard';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Post('')
    async create(@Body() req: User): Promise<void> {
        await this.userService.createUser(req);
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async getOneUserBoards(@Param('id') id: number, @Req() req: any): Promise<BoardToUserDTO> {
        return this.userService.findOneUserBoards(id, req.user.userId);
    }

    @Get('/fetch')
    async getUserList(): Promise<UsersDTO[]> {
        return await this.userService.findAllUser();
    }

    @Patch('update/:id')
    async update(@Param('id') id: number, @Body() req: User): Promise<void> {
        await this.userService.updateUserInfo(id, req);
    }
    
    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.userService.deleteUserInfo(id);
    }

    @Post('/board')
    async createBoard(@Body() req: Board): Promise<void> {
        await this.userService.createBoard(req);
    }

    @Patch('board/:id')
    async updateBoard(@Param('id') id: number, @Body() req: User): Promise<void> {
        await this.userService.updateBoard(id, req);
    }
}
