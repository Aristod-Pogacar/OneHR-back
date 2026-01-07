import { Module } from '@nestjs/common';
import { ViewsDashboardController } from './views.dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../employee/entities/employee.entity';
import { EmployeeService } from '../../employee/employee.service';
import { SmiaOstieService } from '../../smia_ostie/smia_ostie.service';
import { SmiaOstie } from '../../smia_ostie/entities/smia_ostie.entity';
import { Leave } from '../../leave/entities/leave.entity';
import { LeaveService } from '../../leave/leave.service';
import { Permission2hService } from '../../permission2h/permission2h.service';
import { Permission2h } from '../../permission2h/entities/permission2h.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { PayrollService } from 'src/payroll/payroll.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, SmiaOstie, Leave, Permission2h, Payroll, User]),  // 🔥 OBLIGATOIRE
  ],
  controllers: [ViewsDashboardController],
  providers: [EmployeeService, SmiaOstieService, LeaveService, Permission2hService, PayrollService, UsersService],
})
export class ViewsDashboardModule {}
