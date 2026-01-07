import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicalServiceService } from './medical_service.service';
import { CreateMedicalServiceDto } from './dto/create-medical_service.dto';
import { UpdateMedicalServiceDto } from './dto/update-medical_service.dto';

@Controller('medical-service')
export class MedicalServiceController {
  constructor(private readonly medicalServiceService: MedicalServiceService) {}

  @Post()
  create(@Body() createMedicalServiceDto: CreateMedicalServiceDto) {
    return this.medicalServiceService.create(createMedicalServiceDto);
  }

  @Get()
  findAll() {
    return this.medicalServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicalServiceDto: UpdateMedicalServiceDto) {
    return this.medicalServiceService.update(+id, updateMedicalServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalServiceService.remove(+id);
  }
}
