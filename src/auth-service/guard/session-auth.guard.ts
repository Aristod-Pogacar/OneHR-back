import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class SessionAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        if (req.isAuthenticated && req.isAuthenticated()) {
            return true;
        }

        // 👇 REDIRECTION AU LIEU DE 403
        res.redirect('/login');
        return false;
    }
}
