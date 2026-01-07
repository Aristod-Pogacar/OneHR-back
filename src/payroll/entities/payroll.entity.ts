import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("payrolls")
export class Payroll {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Employee, { eager: true })
    @JoinColumn({
        name: 'matricule',
        referencedColumnName: 'matricule',
    })
    employee: Employee;
}
