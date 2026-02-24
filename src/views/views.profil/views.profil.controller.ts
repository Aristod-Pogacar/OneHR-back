import { Response } from 'express'; // ✅ SEULE VERSION CORRECTE
import { Controller, Get, Post, Redirect, Render, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { EmployeeService } from 'src/employee/employee.service';
import { SessionAuthGuard } from 'src/auth-service/guard/session-auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('views-profil')
export class ViewsProfilController {
    constructor(
        private readonly userService: UsersService,
        private readonly employeeService: EmployeeService,
    ) { }

    @Get()
    @Render('profil')
    @UseGuards(SessionAuthGuard)
    async profil(@Req() req) {
        const user = await this.userService.findOne(req.user.id);
        return { user, pageTitle: "Profil", site: "" };
    }

    @Get('edit')
    @Render('profil-edit')
    @UseGuards(SessionAuthGuard)
    async profilEdit(@Req() req) {
        const user = await this.userService.findOne(req.user.id);
        return { user, pageTitle: "Edit profil", site: "" };
    }

    @Post('edit')
    @UseGuards(SessionAuthGuard)
    async update(@Req() req, @Res() res: Response,) {
        console.log(req.body);

        const employee = req.user.employee;
        console.log("employee:", employee);

        // const employee = await this.employeeService.findOne(req.user.employee_id);
        employee.sector = req.body.sector;
        employee.line = req.body.line;
        employee.gender = req.body.gender;
        employee.fullname = req.body.fullname;
        employee.occupation = req.body.occupation;
        employee.site = req.body.site;
        employee.adress = req.body.adress;

        await this.employeeService.updateEmployee(employee.matricule, employee);
        await this.userService.update(req.user.id, {
            email: req.body.email,
            role: req.user.role
        });
        const user = await this.userService.findOne(req.user.id);
        // user.email = req.body.email
        return res.redirect('/views-profil');
    }

    @Get('edit-password')
    @Render('profil-edit-password')
    @UseGuards(SessionAuthGuard)
    async profilEditPassword(@Req() req) {
        const error = req.session.error;
        delete req.session.error;
        const user = await this.userService.findOne(req.user.id);
        return { user, pageTitle: "Edit password", site: "", error };
    }

    @Post('edit-password')
    @UseGuards(SessionAuthGuard)
    async updatePassword(@Req() req, @Res() res: Response) {
        const { currentPassword, password, confirmPassword } = req.body;
        const user = await this.userService.findOne(req.user.id);
        const isMatch = user && await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            req.session.error = "Current password is incorrect";
            return res.redirect('/views-profil/edit-password');
        }

        if (password !== confirmPassword) {
            req.session.error = "Passwords do not match";
            return res.redirect('/views-profil/edit-password');
        }

        await this.userService.updatePassword(user, password);
        return res.redirect('/views-profil');
    }
}
