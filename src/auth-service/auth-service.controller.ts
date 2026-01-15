import { Controller, Get, Post, UseGuards, Render, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller()
export class AuthViewController {

    @Get('/login')
    @Render('login')
    loginPage(@Req() req) {
        const error = req.session.error;
        delete req.session.error;

        return { error, pageTitle: "Login" };
    }

    @Post('/login')
    @UseGuards(LocalAuthGuard)    // @UseGuards(AuthGuard('local'))
    login(@Req() req, @Res() res: Response) {
        req.login(req.user, (err) => {
            if (err) {
                return res.redirect('/login');
            }
            if (req.body.remember === '1') {
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 jours
            } else {
                req.session.cookie.expires = false;
            }
            return res.redirect('/');
        });
    }

    @Get('/logout')
    logout(@Req() req, @Res() res: Response) {
        req.logout(() => { });
        res.redirect('/login');
    }
}
