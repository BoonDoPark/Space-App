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
    
    async fineOneUser(id: number): Promise<UserDTO> {
        const userInfo: UserDTO = await this.userRepository.findOneBy({id});
        if (!userInfo) {
            throw new NotFoundException();
        }
        return userInfo;
    }
    
    async fineBoardsByUser(userInfo: UserDTO): Promise<BoardDTO[]> {
        const boards: BoardDTO[] = await this.boardRepository.find(
            {
                relations: {
                    user: true,
                },
                where: {
                    user: {
                        id: userInfo.id,
                    }
                }
            }
            )
            return boards
        }
        
        async findOneUserBoardAll(id: number, userId: number): Promise<BoardToUserDTO> {
            if (Number(id) !== userId) {
                throw new UnauthorizedException();
            }
            const userInfo = await this.fineOneUser(id);
            const boards = await this.fineBoardsByUser(userInfo);
            const parsedBoards = boards.map((v) => {
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
                board: parsedBoards
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
