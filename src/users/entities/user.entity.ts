import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
  PAYROLL_OFFICER = 'PAYROLL_OFFICER',
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToOne(() => Employee, { eager: true })
  @JoinColumn({
    name: 'employee',
    referencedColumnName: 'matricule',
  })
  employee: Employee;
}
