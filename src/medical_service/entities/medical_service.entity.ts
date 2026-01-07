import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MedicalService {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}
