import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('leaves')
export class Leave {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Employee, (employee) => employee.leaves, { eager: true })
    @JoinColumn({ name: 'employee_matricule', referencedColumnName: 'matricule' })
    employee: Employee;

    @Column({
        length: 20
    })
    leave_type: string;

    @Column({
        length: 20
    })
    start_date: string;

    @Column({
        length: 20
    })
    end_date: string;

    @Column({
        length: 20
    })
    attach_file?: string; // chemin vers le fichier dans ton PC

    @Column({
        length: 20
    })
    comment: string;

    @Column({
        default: false
    })
    done: boolean;

    @Column({
        nullable: true
    })
    successAt?: Date;
}
