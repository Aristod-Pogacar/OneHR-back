import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { LeaveDto } from './dto/leave.dto';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) { }

  // @Post('post-leave')
  // postLeave(@Body() leaveDto: LeaveDto) {
  //   return this.leaveService.postLeave(leaveDto);
  // }

  @Post()
  create(@Body() createLeaveDto: CreateLeaveDto) {
    console.log(createLeaveDto);
    // return createLeaveDto;

    return this.leaveService.create(createLeaveDto);
  }

  // @Get()
  // findAll() {
  //   return this.leaveService.findAll();
  // }

  @Get(':matricule')
  findOne(@Param('matricule') matricule: string) {
    return this.leaveService.findOne(matricule);
  }

  @Get(':matricule/:year/:month')
  getEmployeeLeavesForMonth(
    @Param('matricule') matricule: string,
    @Param('year') year: number,
    @Param('month') month: number
  ) {
    return this.leaveService.getEmployeeLeavesForMonth(matricule, year, month);
  }

  @Post('count-leave-days')
  countEmployeeLeaveDays(
    @Body('matricule') matricule: string,
    @Body('leave_type') leave_type: string,
    @Body('year') year: number
  ) {
    return this.leaveService.countEmployeeLeaveDays(matricule, leave_type, year);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
  //   return this.leaveService.update(+id, updateLeaveDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.leaveService.remove(+id);
  // }
}
