import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin')
export class Admin {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ nullable: false, default: "1234" })
    matricule: string;

    @Column({ length: 255, nullable: false, default: "1234" })
    password: string;

}
