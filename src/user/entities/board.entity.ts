import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Coment } from "./coment.entity";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true})
    content: string;

    @ManyToOne(() => User, (user) => user.board)
    user: User;

    @OneToMany(() => Coment, (coments) => coments.board)
    coments: Coment[];
}