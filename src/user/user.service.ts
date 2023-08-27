import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BoardDTO, BoardToUserDTO, UserDTO, UsersDTO, userInfoDTO } from './dto/read-dto.interface';
import { Board } from './entities/board.entity';
import { Coment } from './entities/coment.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Board) private boardRepository: Repository<Board>,
        @InjectRepository(Coment) private comentRepository: Repository<Coment>,
    ) {}

    async findBoardAll(id: number): Promise<BoardToUserDTO> {
        const userInfo: UserDTO = await this.userRepository.findOneBy({id: id});
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
                content: v.content
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

    async createUser(req: User): Promise<void> {
        await this.userRepository.save(req);
    }

    async createBoard(req: Board): Promise<void> {
        await this.boardRepository.save(req);
    }
    
    // async createComent(req: Coment): Promise<void> {
    //     await this.userRepository.save(req);
    // }

    async updateUser(id: number, req: any): Promise<void>{
        await this.userRepository.update(id, {
            password: req.password,
            nickName: req.nickName,
            userSex: req.userSex,
            profile: req.profile
        });
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
