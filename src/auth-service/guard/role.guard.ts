import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // 🔓 Pas de restriction
        if (!requiredRoles) return true;

        const req = context.switchToHttp().getRequest();
        const user = req.user;

        // ❌ connecté mais rôle non autorisé → 404
        if (user && !requiredRoles.includes(user.role)) {
            throw new NotFoundException();
        }

        return true;
    }
}
