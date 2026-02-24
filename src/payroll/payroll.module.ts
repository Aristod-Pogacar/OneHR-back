import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, Employee]),  // 🔥 OBLIGATOIRE
  ],
  controllers: [PayrollController],
  providers: [PayrollService, EmployeeService, CryptoService],
})
export class PayrollModule { }
