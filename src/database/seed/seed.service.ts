import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        private configService: ConfigService,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async createDefaultSuperAdmin() {
        const email = this.configService.get<string>('ADMIN_DEFAULT_LOGIN');
        const password = this.configService.get<string>('ADMIN_DEFAULT_PASSWORD');

        if (!email || !password) {
            this.logger.warn('ADMIN_DEFAULT_LOGIN or PASSWORD missing');
            return;
        }

        // 🔍 Vérifie si le SUPER ADMIN existe déjà
        const exists = await this.userRepo.findOne({
            where: { email },
        });

        if (exists) {
            this.logger.log('SUPER ADMIN already exists');
            return;
        }

        // 🔐 Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const superAdmin = this.userRepo.create({
            email,
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
            employee: null, // 👈 IMPORTANT
        });

        await this.userRepo.save(superAdmin);

        this.logger.log('SUPER ADMIN created successfully');
    }
}
