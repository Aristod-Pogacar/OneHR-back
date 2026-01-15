import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        try {
            const result = (await super.canActivate(context)) as boolean;

            const req = context.switchToHttp().getRequest();
            await super.logIn(req); // 👈 crée la session

            return result;
        } catch (err) {
            const req = context.switchToHttp().getRequest();
            const res = context.switchToHttp().getResponse();

            // 💬 message d’erreur
            req.session.error = 'Incorect login or password';

            res.redirect('/login');
            return false;
        }
    }
}
