import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserMapppingSpace } from "./userMappingSpace.entity";

@Entity()
export class Space {
    constructor(id: number) {
        this.id = id;
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    spaceName: string;

    @Column({nullable: true})
    logo: string;

    @OneToMany(() => UserMapppingSpace, (userMapppingSpace) => userMapppingSpace.space)
    userMapppingSpace: UserMapppingSpace[];
}