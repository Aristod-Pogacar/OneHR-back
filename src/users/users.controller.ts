import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Response } from 'express'; // ✅ SEULE VERSION CORRECTE

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('login')
  login(@Body() { email, password }: { email: string; password: string }) {
    return this.usersService.login(email, password);
  }

  @Post('validate')
  validateUser(@Body() { email, password }: { email: string; password: string }) {
    return this.usersService.validateUser(email, password);
  }

  @Get('get-by-role')
  getByRole(@Query('role') role: UserRole) {
    return this.usersService.getByRole(role);
  }

  @Get('get-users-by-role')
  getUsersByRole(@Query('role') role: UserRole) {
    return this.usersService.getUsersByRole(role);
  }

  @Post('verify-admin-payroll')
  async verifyAdminPayroll(@Req() req, @Res() res: Response) {
    const { email, password } = req.body;
    const user = await this.usersService.findByEmail(email);

    if (user && (user.role === UserRole.ADMIN || user.role === UserRole.PAYROLL_OFFICER)) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.status(200).json({ success: true, role: user.role });
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

}
