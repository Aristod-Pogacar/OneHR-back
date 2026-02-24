import { Module } from '@nestjs/common';
import { ViewsSystemConfigController } from './views.system.config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalService } from 'src/medical_service/entities/medical_service.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { MedicalServiceService } from 'src/medical_service/medical_service.service';
import { PayrollService } from 'src/payroll/payroll.service';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, MedicalService, Payroll, User]),  // 🔥 OBLIGATOIRE
  ],
  controllers: [ViewsSystemConfigController],
  providers: [EmployeeService, MedicalServiceService, PayrollService, UsersService, CryptoService],
})
export class ViewsSystemConfigModule { }
