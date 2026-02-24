import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { CryptoService } from 'src/crypto/crypto.service';

// users.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employee]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmployeeService,
    CryptoService,
  ],
  exports: [
    UsersService, // 👈 exposé aux autres modules
  ],
})
export class UsersModule { }
// 0383129813