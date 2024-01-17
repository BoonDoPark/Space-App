import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { Repository } from 'typeorm';
import { JoinSpaceStringDTO } from './dto/update.interface';
import { User } from 'src/user/entities/user.entity';
import { ResponseSpaceDTO, SpaceDTO, UserNameDTO } from './dto/read.interface';
import { UserMapppingSpace } from './entities/userMappingSpace.entity';
import { UserDTO, UserIdDTO } from 'src/user/dto/read-dto.interface';
import { NotFoundError, map } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SpaceService {
    constructor(
        @InjectRepository(Space) private spaceRepository: Repository<Space>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserMapppingSpace) private userMappingSpaceRepository: Repository<UserMapppingSpace>,
    ) {}

    
    
    async findSpaces(): Promise<SpaceDTO[]> {
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

    async findOneSpace(spaceId: number): Promise<SpaceDTO> {
        const spaceInfo: SpaceDTO = await this.spaceRepository.findOneBy({id: spaceId});
        if (!spaceInfo) {
            throw new Error('space not exist');
        }

        return spaceInfo;
    }

    async mappingUserAndSpace(spaceId: number, userId: number): Promise<UserMapppingSpace[]> {
        const userMappingSpace: UserMapppingSpace[] = await this.userMappingSpaceRepository.find({
            relations: {
                space: true,
                user: true,
            },
            where: {
                space: {
                    id: spaceId,
                },
                user: {
                    id: userId,
                }
            }});
        if (userMappingSpace.length <= 0) {
            throw new NotFoundException();
        }
        return userMappingSpace;
    }

    async findUsers(spaceId: number, userId: number): Promise<UserDTO[]> {
        const spaceMappingUser = await this.mappingUserAndSpace(spaceId, userId)
        const users: UserDTO[] = await this.userRepository.find({
            relations: {
                userMapppingSpace: true
            },
            where: {
                    userMapppingSpace: 
                    {
                        user: spaceMappingUser.map((v) => v.user)
                    },
                }
        });

        return users;
    }

    async findUsersBySpace(spaceId: number, userId: number): Promise<ResponseSpaceDTO> {
        const spaceInfo = await this.findOneSpace(spaceId);
        const users = await this.findUsers(spaceId, userId)
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

    async createSpace(req: Space, userUid: number): Promise<void> {
        const user = await this.userRepository.findOneBy({id: userUid});
        if (!user) {
            throw new NotFoundException();
        }
        

        const space = await this.spaceRepository.save({
            id: req.id,
            spaceName: req.spaceName,
            logo: req.logo
        });
        
        await this.userMappingSpaceRepository.save({
            user: new User(user.id),
            space: new Space(space.id)
        })
    }

    async addUserInSpace(spaceId: number, userId: number): Promise<void> {
        const space = await this.spaceRepository.findOneBy({id: spaceId})
        if (!space) {
            throw new NotFoundException();
        }

        const user = await this.userRepository.findOneBy({id: userId})
        if (!user) {
            throw new NotFoundException();
        }

        await this.userMappingSpaceRepository.save({
            space: new Space(spaceId), 
            user: new User(userId)
        });
    }

    async updateSpace(id: number, req: Space): Promise<void> {
        await this.spaceRepository.update(id, {
            spaceName: req.spaceName,
            logo: req.logo,
        });
    }

    async deleteUserInSpace(id: number, userId: number): Promise<void> {
        
        // 검증 로직 
        //사용자 ID 가 있는지, 없다는 이야기는 -> 로그인화면으로 가야함. NOT FOUND 
        // ID 가 있는데, 해당 ID 가 USER_MAPPING_SPACE 이테이블의 USER ID 와 맞는지 검증
        const space = await this.spaceRepository.findOne({where: {id: id}});
        if (!space) {
            throw new NotFoundException();
        }
        const verifiedUser = await this.userRepository.findOne({where: {id:userId}});
        if (!verifiedUser) {
            throw new NotFoundException();
        }
        
        const verfiedUserAndSpace = await this.mappingUserAndSpace(space.id, userId)
        const verfifiedUser = verfiedUserAndSpace.map((v) => {
            return v.user.id;
        })

        // 최종 로직
        if (Number(verfifiedUser) === userId) {
            await this.userMappingSpaceRepository.delete(verfiedUserAndSpace.map(v => v.id));
        }
    }
}
