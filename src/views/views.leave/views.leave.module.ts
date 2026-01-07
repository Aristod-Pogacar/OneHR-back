import { Module } from '@nestjs/common';
import { ViewsLeaveController } from './views.leave.controller';
import { LeaveService } from 'src/leave/leave.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { Leave } from 'src/leave/entities/leave.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Permission2h } from 'src/permission2h/entities/permission2h.entity';
import { Permission2hService } from 'src/permission2h/permission2h.service';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Leave, Permission2h, Payroll, User]),  // 🔥 OBLIGATOIRE
  ],
  controllers: [ViewsLeaveController],
  providers: [EmployeeService, LeaveService, Permission2hService, UsersService],
})
export class ViewsLeaveModule {}
