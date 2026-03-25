import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post('punch-in')
  postLeave(@Body() employeeDto: EmployeeDto) {
    return this.employeeService.punchIn(employeeDto);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    return this.employeeService.importFromExcel(file);
  }

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':matricule')
  findOne(@Param('matricule') matricule: string) {
    return this.employeeService.findOne(matricule);
  }

  @Patch(':matricule')
  update(@Param('matricule') matricule: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(matricule, updateEmployeeDto);
  }

  @Delete(':matricule')
  remove(@Param('matricule') matricule: string) {
    return this.employeeService.remove(matricule);
  }

  @Post('hash')
  hash(@Body() data: any) {
    return this.employeeService.hashCode(data);
  }

  @Post('compare')
  compare(@Body() data: any) {
    return this.employeeService.compare(data);
  }

  @Post('update-password')
  updatePassword(@Body() data: any) {
    return this.employeeService.updatePassword(data);
  }

  @Get('finding/search-list')
  async searchEmployees(@Query('q') q: string) {
    console.log("Searching for:", q);
    if (!q) {
      return []; // ✅ JSON valide
    }
    return this.employeeService.search(q);
  }
}
