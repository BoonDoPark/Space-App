import { Controller, Delete, Param, Post, Put, Get, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { BoardDTO, BoardToUserDTO, UserDTO, UsersDTO } from './dto/read-dto.interface';
import { Board } from './entities/board.entity';
import { Coment } from './entities/coment.entity';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}
    
    @Get('board/:id')
    async getAllBoards(@Param('id') id: number): Promise<BoardToUserDTO> {
        return this.userService.findBoardAll(id)
    }

    @Get('/fetchList')
    async findAll(): Promise<UsersDTO[]> {
        return await this.userService.findAll();
    }

    @Post()
    async createUser(@Body() req: User): Promise<void> {
        const hashedPassword = await bcrypt.hash(req.password, 10);
        const user = {
            ...req,
            password: hashedPassword,
        }

        await this.userService.createUser(user);
    }

    @Post('/board')
    async createBoard(@Body() req: Board): Promise<void> {
        await this.userService.createBoard(req);
    }

    // @Post('coment')
    // async createComent(@Body() req: Coment): Promise<void> {
    //     await this.userService.createComent(req);
    // }

    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.userService.deleteUser(id);
    }

    @Patch('update/:id')
    async update(@Param('id') id: number, @Body() req: User): Promise<void> {
        await this.userService.updateUser(id, req)
    }
}
