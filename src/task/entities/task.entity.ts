import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    done: boolean;

    @Column({ nullable: true })
    successAt: Date;

}
