import { Module } from '@nestjs/common';
import { ViewsProfilController } from './views.profil.controller';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employee]),  // 🔥 OBLIGATOIRE
  ],
  controllers: [ViewsProfilController],
  providers: [EmployeeService, UsersService, CryptoService],
})
export class ViewsProfilModule { }
