import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { Employee } from 'src/employee/entities/employee.entity';
import { Leave } from './entities/leave.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Leave, Employee]),
  ],
  controllers: [LeaveController],
  providers: [LeaveService, CryptoService],
})
export class LeaveModule { }
