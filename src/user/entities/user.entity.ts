import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board.entity";
import { Space } from "src/space/entities/space.entity";
import { UserMapppingSpace } from "src/space/entities/userMappingSpace.entity";

// id 값만 가져오고 싶을때는 constructor() {}를 사용하여 가져옴
@Entity()
export class User {
    constructor(
        id: number
    ) {this.id = id}
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    email: string
    
    @Column()
    password: string
    
    @Column()
    nickName: string
    
    @Column()
    userSex: string
    
    @Column({nullable: true})
    profile: string

    @Column({nullable: true})
    refreshToken: string;

    @OneToMany(() => Board, (board) => board.user)
    board: Board[];

    @OneToMany(() => UserMapppingSpace, (userMapppingSpace) => userMapppingSpace.user, {
        cascade: true,
    })
    userMapppingSpace: UserMapppingSpace[];
}