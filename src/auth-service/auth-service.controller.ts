import { Controller, Get, Post, UseGuards, Render, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller()
export class AuthViewController {

    @Get('/login')
    @Render('login')
    loginPage() {
        return {
            "pageTitle": "Login"
        };
    }

    @Post('/login')
    @UseGuards(AuthGuard('local'))
    login(@Req() req, @Res() res: Response) {
        req.login(req.user, (err) => {
            if (err) {
                return res.redirect('/login');
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
