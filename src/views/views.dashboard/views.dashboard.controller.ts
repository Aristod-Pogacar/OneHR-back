import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { EmployeeService } from '../../employee/employee.service';
import { SmiaOstieService } from '../../smia_ostie/smia_ostie.service';
import { LeaveService } from '../../leave/leave.service';
import { Permission2hService } from '../../permission2h/permission2h.service';
import { SessionAuthGuard } from 'src/auth-service/guard/session-auth.guard';
import { AuthenticatedGuard } from 'src/auth-service/guard/auth.guared';

@Controller('/views')
// @UseGuards(AuthenticatedGuard)
export class ViewsDashboardController {

  constructor(private readonly employeeService: EmployeeService, private readonly smiaOstieService: SmiaOstieService, private readonly leaveService: LeaveService, private readonly permission2hService: Permission2hService) { }

  @Get()
  @UseGuards(SessionAuthGuard)
  @Render('index')
  async index(@Req() req) {
    const employees = await this.employeeService.findAll();
    const smiaCountToday = await this.smiaOstieService.countToday();
    const leaveCountToday = await this.leaveService.countToday();
    const permission2hCountToday = await this.permission2hService.countToday();
    console.log("USER ROLE:", req.user.role);

    return {
      "employees": employees,
      "pageTitle": "Dashboard",
      "site": "",
      "smiaCountToday": smiaCountToday,
      "leaveCountToday": leaveCountToday,
      "permission2hCountToday": permission2hCountToday,
      "user": req.user
    };
  }

}
