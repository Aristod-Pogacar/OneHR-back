import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Payroll]),  // 🔥 OBLIGATOIRE
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule { }
