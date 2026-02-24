import { Response } from 'express'; // ✅ SEULE VERSION CORRECTE
import { BadRequestException, Body, Controller, Get, Param, Post, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { MedicalService } from 'src/medical_service/entities/medical_service.entity';
import { MedicalServiceService } from 'src/medical_service/medical_service.service';
import { Repository } from 'typeorm';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { PayrollService } from 'src/payroll/payroll.service';
import { User, UserRole } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SessionAuthGuard } from 'src/auth-service/guard/session-auth.guard';
import { Roles } from 'src/auth-service/decorators/roles.decorator';
import { RolesGuard } from 'src/auth-service/guard/role.guard';

@Controller('settings')
export class ViewsSystemConfigController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly medicalServiceService: MedicalServiceService,
    private readonly payrollService: PayrollService,
    private readonly userService: UsersService,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,

    @InjectRepository(MedicalService)
    private medicalServiceRepo: Repository<MedicalService>,

    @InjectRepository(Payroll)
    private payrollRepo: Repository<Payroll>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  @Get('medical-service')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Render('setting-medical-service')
  async getMedicalService(@Req() req, @Query('search') search: string = '', @Query('page') page: number = 1) {
    const limit = 20;
    const { data, total, totalPages } = await this.medicalServiceService.paginateMedicalService(search, Number(page), limit);
    console.log("DATA:", data);

    const currentPage = Number(page);
    const maxButtons = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    return {
      pageTitle: 'Settings - Medical Service',
      data,
      site: "",
      search,
      total,
      totalPages,
      startPage,
      endPage,
      currentPage,
      "user": req.user
    };
  }

  // @Get('medical-service')
  // @Render('setting-medical-service')
  // getMedicalService() {
  //     const medicalServices = this.medicalServiceRepo.find();
  //     return {
  //         pageTitle: 'Settings - Medical Service',
  //         data: medicalServices,
  // };
  // }

  @Post('medical-service')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async importTest(
    @Body() body: any,
    @Res() res: Response,
  ) {
    console.log("Name:", body.name);
    await this.medicalServiceService.create({ name: body.name });
    return res.redirect('/settings/medical-service');
  }

  @Post('medical-service/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async updateMedicalService(
    @Param('id') id: number,
    @Body() body: any,
    @Res() res: Response,
  ) {
    console.log("Name:", body.name);
    await this.medicalServiceService.update(id, { name: body.name });
    return res.redirect('/settings/medical-service');
  }

  @Post('medical-service/:id/delete')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async deleteMedicalService(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    await this.medicalServiceService.remove(id);
    return res.redirect('/settings/medical-service');
  }

  @Get('payroll-list')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Render('setting-payroll')
  async getPayroll(@Req() req, @Query('search') search: string = '', @Query('page') page: string = '1') {
    const limit = 20;
    console.log("PAGE:", page);
    console.log("SEARCH:", search);

    const { data, total, totalPages } = await this.payrollService.paginatePayroll(search, Number(page), limit);
    console.log("DATA:", data);
    data.forEach((element: any) => {
      console.log("Employee:", element);
    });
    const currentPage = Number(page);
    const maxButtons = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const employees = await this.employeeRepo.find();
    employees.forEach((element: any) => {
      console.log("Employee:", element);
    });
    return {
      site: "",
      pageTitle: 'Settings - Payroll Officers',
      data,
      search,
      total,
      totalPages,
      startPage,
      endPage,
      currentPage,
      employees,
      "user": req.user
    };
  }

  @Post('payroll-list/create')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async createPayroll(
    @Body() body,
    @Res() res,
  ) {
    const { matricule, email, password, confirm_password } = body;

    await this.payrollService.create({
      email: email,
      employee: matricule,
      password: password
    });

    return res.redirect('/settings/payroll-list');
  }

  @Post('payroll-list/update/:id')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async updatePayroll(
    @Body() body,
    @Param('id') id: string,
    @Res() res,
  ) {
    const { matricule, email, password, confirm_password } = body;

    await this.payrollService.update(+id, {
      email: email,
      employee: matricule,
      password: password
    });

    return res.redirect('/settings/payroll-list');
  }

  @Post('payroll-list/create')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async createPayrollGeneric(
    @Body() body: { email: string; employee: string; password: string },
    @Res() res: Response,
  ) {
    await this.payrollService.create({
      email: body.email,
      employee: body.employee,
      password: body.password,
    });
    return res.redirect('/settings/payroll-list');
  }

  @Get('payroll-list/new')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Render('setting-payroll-new')
  async getNewPayroll(@Req() req) {
    const employees = await this.employeeRepo.find();
    return {
      pageTitle: 'Settings - New Payroll Officer',
      employees,
      site: "",
      "user": req.user
    };
  }

  @Get('payroll-list/edit/:id')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Render('setting-payroll-edit')
  async getEditPayroll(@Req() req, @Param('id') id: string) {
    const payroll = await this.payrollService.findOne(+id);
    if (!payroll) {
      throw new BadRequestException('Payroll not found');
    }
    const employees = await this.employeeRepo.find();
    console.log("Payroll:", payroll);
    return {
      pageTitle: 'Settings - Edit Payroll Officer',
      payroll,
      employees,
      site: "",
      "user": req.user
    };
  }

  @Post('payroll-list/:id/edit')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async editPayroll(
    @Param('id') id: string,
    @Body() body: { email: string; employee: string; },
    @Res() res: Response,
  ) {
    await this.payrollService.update(+id, {
      email: body.email,
      employee: body.employee
    });
    return res.redirect('/settings/payroll-list');
  }

  @Post('payroll-list/:id/delete')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async deletePayroll(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.payrollService.remove(+id);
    return res.redirect('/settings/payroll-list');
  }

  @Get('user')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Render('setting-user')
  async getUSer(@Req() req, @Query('search') search: string = '', @Query('page') page: string = '1') {
    const limit = 20;
    console.log("PAGE:", page);
    console.log("SEARCH:", search);

    const { data } = await this.userService.paginateUser(search, Number(page), limit);
    console.log("DATA:", data);
    data.forEach((element: any) => {
      console.log("USER:", element);
    });

    return {
      site: "",
      pageTitle: 'Settings - Users',
      data,
      "user": req.user
    };
  }

  @Post('user/create')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async createUser(
    @Body() body,
    @Res() res,
  ) {
    const { matricule, email, password, role } = body;
    console.log("BODY:", body);


    await this.userService.create({
      email: email,
      matricule: matricule,
      password: password,
      role: UserRole[role],
    });

    return res.redirect('/settings/user');
  }

  @Post('user/update/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async updateUser(
    @Body() body,
    @Param('id') id: string,
    @Res() res,
  ) {
    const { matricule, email, password, role } = body;

    await this.userService.update(+id, {
      email: email,
      matricule: matricule,
      password: password,
      role: UserRole[role],
    });

    return res.redirect('/settings/user');
  }

  @Post('user/create')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async createUSerGeneric(
    @Body() body: { email: string; employee: string; password: string },
    @Res() res: Response,
  ) {
    await this.userService.create({
      email: body.email,
      matricule: body.employee,
      password: body.password,
      role: UserRole.USER,
    });
    return res.redirect('/settings/user');
  }

  @Get('user/new')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Render('setting-user-new')
  async getNewUser(@Req() req) {
    const employees = await this.employeeRepo.find();
    const roles = Object.values(UserRole);
    console.log("ROLES:", roles);
    return {
      pageTitle: 'Settings - New User',
      employees,
      site: "",
      roles,
      "user": req.user
    };
  }

  @Get('user/edit/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Render('setting-user-edit')
  async getEditUser(@Req() req, @Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const employees = await this.employeeRepo.find();
    console.log("User:", user);
    const roles = Object.values(UserRole);
    console.log("ROLES:", roles);
    return {
      pageTitle: 'Settings - Edit User',
      'us': user,
      employees,
      site: "",
      roles,
      "user": req.user
    };
  }

  @Post('user/:id/edit')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async editUser(
    @Param('id') id: string,
    @Body() body: { email: string; employee: string; role: string },
    @Res() res: Response,
  ) {
    await this.userService.update(+id, {
      email: body.email,
      matricule: body.employee,
      role: UserRole[body.role],
    });
    return res.redirect('/settings/user');
  }

  @Post('user/:id/delete')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  async deleteUSer(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.userService.remove(+id);
    return res.redirect('/settings/user');
  }

  @Get('user/payroll')
  @Roles(UserRole.ADMIN, UserRole.PAYROLL_OFFICER, UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Render('setting-user-payroll')
  async getUsersByRole(@Req() req, @Query('role') role: string = UserRole.PAYROLL_OFFICER) {
    console.log("ROLE:", role);

    const users = await this.userService.getUsersByRole(UserRole[role]);
    console.log("USERS:", users);
    return {
      pageTitle: 'Settings - Payroll Officers',
      data: users,
      site: "",
      "user": req.user
    };
  }

}
