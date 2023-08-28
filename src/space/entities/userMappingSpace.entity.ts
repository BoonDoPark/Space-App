import { User } from "src/user/entities/user.entity";
import { Column, Entity, Generated, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Space } from "./space.entity";

@Entity()
export class UserMapppingSpace {
    @PrimaryGeneratedColumn()
    @Generated('increment')
    id: number;

    @ManyToOne(() => User, (user) => user.userMapppingSpace)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Space, (space) => space.userMapppingSpace)
    @JoinColumn()
    space: Space;
}