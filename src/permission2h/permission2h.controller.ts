import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Permission2hService } from './permission2h.service';
import { CreatePermission2hDto } from './dto/create-permission2h.dto';
import { UpdatePermission2hDto } from './dto/update-permission2h.dto';

@Controller('permission2h')
export class Permission2hController {
  constructor(private readonly permission2hService: Permission2hService) {}

  @Post()
  create(@Body() createPermission2hDto: CreatePermission2hDto) {
    return this.permission2hService.create(createPermission2hDto);
  }

  @Get()
  findAll() {
    return this.permission2hService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permission2hService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermission2hDto: UpdatePermission2hDto) {
    return this.permission2hService.update(+id, updatePermission2hDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permission2hService.remove(+id);
  }

  // @Post('send-email')
  // sendEmail() {
  //   return this.permission2hService.sendEmail();
  // }
}
