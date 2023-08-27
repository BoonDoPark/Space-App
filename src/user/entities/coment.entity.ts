import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board.entity";

@Entity()
export class Coment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    coments: string;

    @ManyToOne(() => Board, (board) => board.coments)
    board: Board;
}