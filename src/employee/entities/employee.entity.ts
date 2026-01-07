import { Leave } from 'src/leave/entities/leave.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { Permission2h } from 'src/permission2h/entities/permission2h.entity';
import { SmiaOstie } from 'src/smia_ostie/entities/smia_ostie.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('employees')
export class Employee {

    @PrimaryColumn({
        length: 20,
        unique: true,
    })
    matricule: string;

    @Column({
        length: 250
    })
    password: string;

    @Column({
        length: 255,
        default: "0000"
    })
    appPassword: string;

    @Column({
        length: 20
    })
    division: string;

    @Column({
        length: 20
    })
    sector: string;

    @Column({
        length: 20
    })
    departement: string;

    @Column({
        length: 20
    })
    line: string;

    @Column({
        length: 10
    })
    gender: string;

    @Column({
        length: 100
    })
    fullname: string;

    @Column({
        length: 20
    })
    occupation: string;

    @Column({
        length: 20
    })
    site: string;

    @Column({
        length: 100
    })
    adress: string;

    @OneToMany(() => Leave, (leave) => leave.employee)
    leaves: Leave[];

    @OneToMany(() => SmiaOstie, (smia_ostie) => smia_ostie.employee)
    smia_ostie: SmiaOstie[];

    @OneToMany(() => Permission2h, (permission2h) => permission2h.employee)
    permission2h: Permission2h[];

    @OneToOne(() => Payroll, payroll => payroll.employee)
    payroll: Payroll;
}
