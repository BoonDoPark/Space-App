import { Controller, Delete, Param, Post, Put, Get, Body, Patch, UseGuards, Req, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { BoardDTO, BoardToUserDTO, UserDTO, UsersDTO } from './dto/read-dto.interface';
import { Board } from './entities/board.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-access.guard';
import { AuthUser } from 'src/auth/user.decorator';
import { Payload } from 'src/auth/dto/login.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Get('/test')
    @UseGuards(JwtAuthGuard)
    async test(@Req() req: any) {
        console.log(req.user);
    }

    @Get('/info')
    @UseGuards(JwtAuthGuard)
    async getAllBoards(@Req() req: any): Promise<BoardToUserDTO> {
        console.log(req.user);
        return this.userService.findOneUserBoardAll(req.user.userId);
    }

    @Get('/fetchList')
    async findAll(): Promise<UsersDTO[]> {
        return await this.userService.findAll();
    }

    @Post()
    async createUser(@Body() req: User): Promise<void> {
        await this.userService.createUser(req);
    }

    @Post('/board')
    async createBoard(@Body() req: Board): Promise<void> {
        await this.userService.createBoard(req);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.userService.deleteUser(id);
    }

    @Patch('update/:id')
    async update(@Param('id') id: number, @Body() req: User): Promise<void> {
        await this.userService.updateUser(id, req);
    }

    @Patch('board/:id')
    async updateBoard(@Param('id') id: number, @Body() req: User): Promise<void> {
        
    }
}
