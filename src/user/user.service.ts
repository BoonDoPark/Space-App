import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BoardDTO, BoardToUserDTO, UserDTO, UsersDTO, userInfoDTO } from './dto/read-dto.interface';
import { Board } from './entities/board.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Board) private boardRepository: Repository<Board>,
    ) {}

    async findOneUserBoardAll(id: number): Promise<BoardToUserDTO> {
        const userInfo: UserDTO = await this.userRepository.findOneBy({id: id});
        if (!userInfo) {
            throw new NotFoundException();
        }
        const boardAll: BoardDTO[] = await this.boardRepository.find({ 
            relations: {
                user: true,
            },
            where: {
                user: {
                    id: userInfo.id,
                }
            }});

        const parseBoardAll = boardAll.map((v) => {
            return {
                id: v.id,
                title: v.title,
                content: v.content,
            }
        })
        return {
            user: {
                id: userInfo.id,
                email: userInfo.email,
                nickName: userInfo.nickName,
                userSex: userInfo.userSex,
                profile: userInfo.profile
            },
            board: parseBoardAll
        }
    }

    async findAll(): Promise<UsersDTO[]> {
        const users = await this.userRepository.find();
        const userAll: UsersDTO[] = users.map((v) => {
            return {
                id: v.id,
                nickName: v.nickName,
                userSex: v.userSex,
                profile: v.profile,
            }
        })
        return userAll;
    }

    async findOne(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({email: email});
        if (!user) {
            throw new NotFoundException(`Not found ${email}`);
        }
        return user;
    }

    async createUser(req: User): Promise<string> {
        const exist = this.userRepository.findOneBy({email : req.email})
        if (exist) {
            return "There is a user with that email already";
        }
        const hashedPassword = await bcrypt.hash(req.password, 10);
        const user = {
            ...req,
            password: hashedPassword,
        }
        await this.userRepository.save(req);
    }

    async createBoard(req: Board): Promise<void> {
        await this.boardRepository.save(req);
    }

    async updateUser(id: number, req: any): Promise<void>{
        try {
            const user = await this.userRepository.findOne({where: {id}});
            if (user.id == id) return (user.password = req.password);
            if (user.id == id) return (user.nickName = req.nickName);
            if (user.id == id) return (user.userSex = req.userSex);
            if (user.id == id) return (user.profile = req.profile);
            await this.userRepository.save({
                password: user.password,
                nickName: user.nickName,
                userSex: user.userSex,
                profile: user.profile
            });
        } catch(error) {
            throw new Error('is not update');
        }
    }

    async updateBoard(id: number, req: any): Promise<void> {
        try {
            const board = await this.boardRepository.findOne({where: {id}});
            if (board.id == id) return (board.title = req.title);
            if (board.id == id) return (board.content = req.content);
            await this.boardRepository.save({
                title: board.title,
                content: board.content,
            });
        } catch(error) {
            throw new Error('is not update');
        }
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
