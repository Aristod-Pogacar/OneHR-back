import { Module } from '@nestjs/common';
import { ViewsEmployeeController } from './views.employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../employee/entities/employee.entity';
import { EmployeeService } from '../../employee/employee.service';
import { SmiaOstieService } from '../../smia_ostie/smia_ostie.service';
import { SmiaOstie } from 'src/smia_ostie/entities/smia_ostie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, SmiaOstie]),  // 🔥 OBLIGATOIRE
  ],
  controllers: [ViewsEmployeeController],
  providers: [EmployeeService, SmiaOstieService],
})
export class ViewsEmployeeModule {}
