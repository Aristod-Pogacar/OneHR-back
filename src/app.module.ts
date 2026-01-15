import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { LeaveModule } from './leave/leave.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { SmiaOstieModule } from './smia_ostie/smia_ostie.module';
import { Permission2hModule } from './permission2h/permission2h.module';
import { ViewsDashboardModule } from './views/views.dashboard/views.dashboard.module';
import { ViewsEmployeeModule } from './views/views.employee/views.employee.module';
import { ViewsLeaveModule } from './views/views.leave/views.leave.module';
import { ViewsSystemConfigModule } from './views/views.system.config/views.system.config.module';
import { MedicalServiceModule } from './medical_service/medical_service.module';
import { PayrollModule } from './payroll/payroll.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth-service/auth-service.service';
import { AuthViewController } from './auth-service/auth-service.controller';
import { AuthServiceModule } from './auth-service/auth-service.module';
import { SeedService } from './database/seed/seed.service';
import { SeedModule } from './database/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ← rend les variables accessibles partout
    }),
    TypeOrmModule.forRootAsync({
      // `imports` est nécessaire si ConfigModule n'est pas global
      imports: [ConfigModule],

      // La fonction qui injecte ConfigService
      useFactory: (configService: ConfigService) => ({
        // Récupération des valeurs depuis le .env via ConfigService
        type: configService.get<'mysql'>('DATABASE_TYPE'),
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),

        // Autres options de configuration TypeORM
        autoLoadEntities: true,
        synchronize: true, // ⚠️ À utiliser avec précaution en production
        logging: ['error'],
        // logging: ['query', 'error'],
      }),

      // Indique à NestJS d'injecter le ConfigService dans la fonction useFactory
      inject: [ConfigService],
    }),
    EmployeeModule,
    LeaveModule,
    AdminModule,
    SmiaOstieModule,
    Permission2hModule,
    ViewsDashboardModule,
    ViewsEmployeeModule,
    ViewsLeaveModule,
    ViewsSystemConfigModule,
    MedicalServiceModule,
    PayrollModule,
    UsersModule,
    AuthServiceModule,
    SeedModule,
  ],
  controllers: [AppController, AuthViewController],
  providers: [AppService, AuthService],
})
export class AppModule { }