import { BadRequestException, Body, Controller, Get, Post, Query, Render, Req, Res, Search, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { EmployeeService } from 'src/employee/employee.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import * as bcrypt from 'bcrypt';
import { Employee } from 'src/employee/entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express'; // ✅ SEULE VERSION CORRECTE
import { SmiaOstieService } from 'src/smia_ostie/smia_ostie.service';
import { SmiaOstie } from 'src/smia_ostie/entities/smia_ostie.entity';
import { SessionAuthGuard } from 'src/auth-service/guard/session-auth.guard';
import { Roles } from 'src/auth-service/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth-service/guard/role.guard';

const dateToday = new Date();

@Controller('views-employee')
export class ViewsEmployeeController {

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly smiaOstieService: SmiaOstieService,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,

  ) { }

  // @Get()
  // @Render('employee-list')
  // async index() {
  //   const employees = await this.employeeService.findAll();
  //   return { "employees": employees, "pageTitle": "Employee lists" };
  // }

  @Get()
  @UseGuards(SessionAuthGuard)
  @Render('employee-list')
  async index(@Req() req, @Query('page') page = 1, @Query('site') site = 'RABE', @Query('search') search = '') {
    const limit = 20;
    const { data, totalPages, total, aquarelleCount, lagunaCount, tanaCount } =
      await this.employeeService.paginate(Number(page), limit, site, search);

    const currentPage = Number(page);
    const maxButtons = 7;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    return {
      employees: data,
      currentPage,
      totalPages,
      total,
      aquarelleCount,
      lagunaCount,
      tanaCount,
      startPage,
      endPage,
      search,
      site,
      pageTitle: 'Employee lists',
      "user": req.user
    };
  }

  // @Get('medical-service')
  // @Render('medical-service')
  // async today(@Query('page') page = 1) {
  //   const limit = 20;

  //   const { data, total, totalPages } =
  //     await this.smiaOstieService.paginateToday(Number(page), limit);

  //   const currentPage = Number(page);
  //   const maxButtons = 7;

  //   let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  //   let endPage = startPage + maxButtons - 1;

  //   if (endPage > totalPages) {
  //     endPage = totalPages;
  //     startPage = Math.max(1, endPage - maxButtons + 1);
  //   }

  //   return {
  //     inscriptions: data,
  //     totalInscriptions: total,
  //     currentPage,
  //     totalPages,
  //     startPage,
  //     endPage,
  //     employees: data,
  //     total,
  //     site : '',
  //     pageTitle: 'Medical Service',
  //   }
  // }

  @Get('medical-service/history')
  // @Roles(UserRole.ADMIN)
  @UseGuards(SessionAuthGuard)
  @Render('medical-service')
  async history(@Req() req, @Query('page') page = 1, @Query('search') search = '', @Query('date') date = "") {
    const limit = 20;

    const { data, total, totalPages } =
      await this.smiaOstieService.paginateHistory(date, search, Number(page), limit);

    const currentPage = Number(page);
    const maxButtons = 7;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    return {
      inscriptions: data,
      totalInscriptions: total,
      currentPage,
      totalPages,
      startPage,
      endPage,
      employees: data,
      total,
      date,
      search,
      site: '',
      pageTitle: 'Medical Service',
      "user": req.user
    }
  }

  @Get('import')
  @Roles(UserRole.ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Render('employee-import')
  async import(@Req() req) {
    return {
      "pageTitle": "Import from Master File",
      site: "",
      "user": req.user
    };
  }

  @Post('test')
  @Roles(UserRole.ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async importTest(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    console.log("File:", file);
    console.log("Body:", body.matricule);

    return res.redirect('/views-employee');
  }

  @Post('import-from-excel')
  @Roles(UserRole.ADMIN)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async importFromExcel(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {

    if (file) {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows: any[] = XLSX.utils.sheet_to_json(worksheet);
      const salt = await bcrypt.genSalt(10);

      // 🎯 Sélectionner uniquement certains champs
      const filtered = rows.map(row => ({
        matricule: body.matricule + row['Emp No'],
        division: row['Division'],
        sector: row['Sect'],
        departement: row['Dept'],
        line: row['Line'],
        gender: row['Gender'],
        fullname: row['Fullname'],
        occupation: row['Occupation'],
        site: row['Sit'],
        adress: row['Adrs street'] + " " + row['Adrs locality'],
        appPassword: bcrypt.hashSync("0000", salt)
      }));

      // ❗ ignorer lignes vides
      const cleanData = filtered.filter(x => x.matricule);

      // 📌 Insérer dans MySQL
      try {
        await this.employeeRepo
          .createQueryBuilder()
          .insert()
          .into(Employee)
          .values(cleanData)
          .orIgnore()  // ⚡ ignore les doublons automatiquement
          .execute();
      } catch (e) {
        console.log(e);
      }
      return res.redirect('/views-employee');
    } else {
      throw new BadRequestException('Aucun fichier reçu');
    }
  }

}
