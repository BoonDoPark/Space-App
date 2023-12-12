import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { Repository } from 'typeorm';
import { JoinSpaceStringDTO } from './dto/update.interface';
import { User } from 'src/user/entities/user.entity';
import { ResponseSpaceDTO, SpaceDTO, UserNameDTO } from './dto/read.interface';
import { UserMapppingSpace } from './entities/userMappingSpace.entity';
import { UserDTO, UserIdDTO } from 'src/user/dto/read-dto.interface';
import { NotFoundError } from 'rxjs';

@Injectable()
export class SpaceService {
    constructor(
        @InjectRepository(Space) private spaceRepository: Repository<Space>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserMapppingSpace) private userMappingSpaceRepository: Repository<UserMapppingSpace>
    ) {}

    
    
    async findAll(): Promise<SpaceDTO[]> {
        const space = await this.spaceRepository.find();
        const spaceAll = space.map((v) => {
            return {
                id: v.id,
                spaceName: v.spaceName,
                logo: v.logo,
            }
        })
        return spaceAll;
    }

    async viewSpace(spaceId: number): Promise<ResponseSpaceDTO> {
        const spaceInfo: SpaceDTO = await this.spaceRepository.findOneBy({id: spaceId});
        const userMappingSpace: UserMapppingSpace[] = await this.userMappingSpaceRepository.find({
            relations: {
                space: true,
                user: true,
            },
            where: {
                space: {
                    id: spaceInfo.id,
                },
            }});
        if (userMappingSpace.length <= 0) {
            throw new NotFoundException('error');
        }
        
        const users: UserDTO[] = await this.userRepository.find({
            relations: {
                userMapppingSpace: true
            },
            where: {
                    userMapppingSpace: 
                    {
                        user: userMappingSpace.map((v) => v.user)
                    }
                }
            })

        const parseUserAll = users.map((value) => {
            return {
                id: value.id,
                nickName: value.nickName,
                userSex: value.userSex,
                profile: value.profile
            }
        })
        return {
            space: {
                id: spaceInfo.id,
                spaceName: spaceInfo.spaceName,
                logo: spaceInfo.logo,
            },
            user: parseUserAll
        }
    }

    async updateUserInSpace(spaceId: number, userId: number): Promise<void> {
        await this.userMappingSpaceRepository.save({
            space: new Space(spaceId), 
            user: new User(userId)});
    }

    async createSpace(req: Space): Promise<void> {
        await this.spaceRepository.save(req);
    }

    async insertSpace(req: Space, userUid: number): Promise<void> {
        const user = await this.userRepository.findOneBy({id: userUid});
        const space = await this.spaceRepository.save({
            spaceName: req.spaceName
        });
        await this.userMappingSpaceRepository.save({
            user: new User(user.id),
            space: new Space(space.id)
        })
    }

    async create(req: Space, user: UserNameDTO): Promise<void> {
        const users = await this.userRepository.findOneBy({id: user.id});
        const space = await this.spaceRepository.save({
            id: req.id,
            spaceName: req.spaceName,
            logo: req.logo,
        });
        await this.userMappingSpaceRepository.save({
            space: new Space(space.id),
            user: new User(users.id)
        });
    }

    async updateSpace(id: number, req: Space): Promise<void> {

        await this.spaceRepository.update(id, {
            spaceName: req.spaceName,
            logo: req.logo,
        });
    }

    async deleteSpace(id: number): Promise<void> {
        
        // 검증 로직 
        //사용자 ID 가 있는지, 없다는 이야기는 -> 로그인화면으로 가야함. NOT FOUND 
        // ID 가 있는데, 해당 ID 가 USER_MAPPING_SPACE 이테이블의 USER ID 와 맞는지 검증 
        const space = await this.spaceRepository.findOne({where: {id: id}});
        const userMappingSpace: UserMapppingSpace[] = await this.userMappingSpaceRepository.find({
            relations: {
                space: true,
                user: true,
            },
            where: {
                space: {
                    id: space.id,
                },
            }});
        if (userMappingSpace.length <= 0) {
            throw new NotFoundException('error');
        }
        const user: UserIdDTO[] = await this.userRepository.find({
            relations: {
                userMapppingSpace: true
            },
            where: {
                    userMapppingSpace: 
                    {
                        user: userMappingSpace.map((v) => v.user)
                    }
                }
            })
        if (!user) {
            throw new NotFoundException();
        }
        

        

        // 최종 로직 
        // await this.spaceRepository.delete(id);
    }
}
