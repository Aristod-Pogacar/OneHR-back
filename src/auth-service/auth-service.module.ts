import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from 'src/users/entities/user.entity';
import { AuthViewController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { UsersService } from 'src/users/users.service';
import { EmployeeService } from 'src/employee/employee.service';
import { LocalStrategy } from './local.strategy';
import { RolesGuard } from './guard/role.guard';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './serializers/auth.serializers';
// auth.module.ts
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        PassportModule.register({ session: true }),
    ],
    controllers: [AuthViewController],
    providers: [
        AuthService,
        LocalStrategy,
        RolesGuard,
        SessionSerializer,
    ],
})
export class AuthServiceModule { }
