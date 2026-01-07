import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.getByEmail(email);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return user;
    }
    async serializeUser(user: any, done: Function) {
        done(null, user.id);
    }

    async deserializeUser(id: number, done: Function) {
        const user = await this.usersService.findById(id);
        done(null, user);
    }
}
