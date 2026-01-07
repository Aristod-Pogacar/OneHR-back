import { Module } from '@nestjs/common';
import { Permission2hService } from './permission2h.service';
import { Permission2hController } from './permission2h.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission2h } from './entities/permission2h.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { PayrollService } from 'src/payroll/payroll.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
    }),
    TypeOrmModule.forFeature([Permission2h, Employee, Payroll, User]),  // 🔥 OBLIGATOIRE
  ],
  controllers: [Permission2hController],
  providers: [Permission2hService, PayrollService, UsersService],
})
export class Permission2hModule {}
