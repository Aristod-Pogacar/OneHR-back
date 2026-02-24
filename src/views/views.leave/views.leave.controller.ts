import { BadRequestException, Body, Controller, Get, Param, Post, Query, Render, Req, Res, Search, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/auth-service/decorators/roles.decorator';
import { RolesGuard } from 'src/auth-service/guard/role.guard';
import { SessionAuthGuard } from 'src/auth-service/guard/session-auth.guard';
import { Leave } from 'src/leave/entities/leave.entity';
import { LeaveService } from 'src/leave/leave.service';
import { Permission2hService } from 'src/permission2h/permission2h.service';
import { UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('views-leave')
export class ViewsLeaveController {

  constructor(
    private readonly leaveService: LeaveService,
    private readonly permission2hService: Permission2hService,

    @InjectRepository(Leave)
    private leaveRepo: Repository<Leave>,

  ) { }

  @Get('leave')
  // @Roles(UserRole.ADMIN)
  @UseGuards(SessionAuthGuard)
  @Render('local-leave')
  async localLeave(@Req() req, @Query('page') page = 1, @Query('search') search = '', @Query('leaveType') leaveType = 'Local_Leave_AMD') {
    const limit = 20;

    const { data, total, totalPages } =
      await this.leaveService.paginateLocalLeave(search, Number(page), limit, leaveType);

    const currentPage = Number(page);
    const maxButtons = 7;

    console.log("DATA:", data);
    let title = 'Local Leave';
    if (leaveType == 'Local_Leave_AMD') {
      title = 'Local Leave';
    } else if (leaveType == 'Permission_AMD') {
      title = 'Permission';
    }

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
      search,
      site: '',
      pageTitle: title,
      "user": req.user
    }
  }

  @Get('permission-2h/get/:id')
  // @Roles(UserRole.ADMIN)
  @UseGuards(SessionAuthGuard)
  @Render('permission-2h')
  async permission2hById(@Req() req, @Query('page') page = 1, @Query('search') search = '', @Query('date') date = '', @Param('id') id: string) {
    const limit = 20;

    const { data, total, totalPages } =
      await this.permission2hService.paginatePermission2hById(Number.parseInt(id), search, Number(page), limit, date);

    const currentPage = Number(page);
    const maxButtons = 7;

    console.log("DATA:", data);
    let title = 'Permission 2h';

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    return {
      totalPermissions: total,
      currentPage,
      totalPages,
      startPage,
      endPage,
      employees: data,
      total,
      search,
      site: '',
      pageTitle: title,
      "user": req.user
    }
  }

  @Get('permission-2h')
  // @Roles(UserRole.ADMIN)
  @UseGuards(SessionAuthGuard)
  @Render('permission-2h')
  async permission2h(@Req() req, @Query('page') page = 1, @Query('search') search = '', @Query('date') date = '') {
    const limit = 20;

    const { data, total, totalPages } =
      await this.permission2hService.paginatePermission2h(search, Number(page), limit, date);

    const currentPage = Number(page);
    const maxButtons = 7;

    console.log("DATA:", data);
    let title = 'Permission 2h';

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    return {
      totalPermissions: total,
      currentPage,
      totalPages,
      startPage,
      endPage,
      employees: data,
      total,
      search,
      site: '',
      pageTitle: title,
      "user": req.user
    }
  }

}
