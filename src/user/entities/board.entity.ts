import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true})
    content: string;

    // @Column({nullable: true})
    // coment: string[];

    @ManyToOne(() => User, (user) => user.board)
    user: User;
}