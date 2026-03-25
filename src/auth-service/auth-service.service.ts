import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(email: string, password: string) {
        const isAdmin = await bcrypt.compare(password, process.env.SUPERADMIN_PASSWORD);
        console.log("isAdmin:", isAdmin);
        if (
            email === process.env.SUPERADMIN_EMAIL &&
            isAdmin
        ) {
            return {
                id: 'superadmin',
                firstName: 'Super',
                name: 'Admin',
                email: process.env.SUPERADMIN_EMAIL,
                role: 'SUPER_ADMIN',
                isSuperAdmin: true,
            };
        }

        const user = await this.usersService.getByEmail(email);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return user;
    }
    async serializeUser(user: any, done: Function) {
        done(null, user.id);
    }

    async deserializeUser(id: any, done: Function) {
        if (id === 'superadmin') {
            return done(null, {
                id: 'superadmin',
                firstName: 'Super',
                name: 'Admin',
                email: process.env.SUPERADMIN_EMAIL,
                role: 'SUPER_ADMIN',
                isSuperAdmin: true,
            });
        }
        const user = await this.usersService.findById(id);
        done(null, user);
    }
}
