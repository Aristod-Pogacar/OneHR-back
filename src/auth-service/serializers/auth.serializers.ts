// auth/session.serializer.ts
import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private usersService: UsersService) {
        super();
    }

    serializeUser(user: any, done: Function) {
        done(null, user.id);
    }

    async deserializeUser(userId: any, done: Function) {
        if (userId === 'superadmin') {
            return done(null, {
                id: 'superadmin',
                firstName: 'Super',
                name: 'Admin',
                email: process.env.SUPERADMIN_EMAIL,
                role: 'SUPER_ADMIN',
                isSuperAdmin: true,
            });
        }
        const user = await this.usersService.findById(userId);
        done(null, user);
    }
}
