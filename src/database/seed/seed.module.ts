import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [
        ConfigModule,            // pour ADMIN_DEFAULT_*
        TypeOrmModule.forFeature([User]),
    ],
    providers: [SeedService],
    exports: [SeedService],      // 👈 IMPORTANT
})
export class SeedModule { }
