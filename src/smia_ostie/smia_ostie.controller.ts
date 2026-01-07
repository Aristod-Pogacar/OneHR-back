import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SmiaOstieService } from './smia_ostie.service';
import { CreateSmiaOstieDto } from './dto/create-smia_ostie.dto';
import { UpdateSmiaOstieDto } from './dto/update-smia_ostie.dto';

@Controller('smia-ostie')
export class SmiaOstieController {
  constructor(private readonly smiaOstieService: SmiaOstieService) {}

  @Post()
  create(@Body() createSmiaOstieDto: CreateSmiaOstieDto) {
    return this.smiaOstieService.create(createSmiaOstieDto);
  }

  @Get()
  findAll() {
    return this.smiaOstieService.findAll();
  }
  
  @Get('list/today')
  findByDateDoingToday() {
    return this.smiaOstieService.findByDateDoingToday();
  }

  @Post('list/by-date')
  findByDate(@Body() {date}: {date: string}) {
    return this.smiaOstieService.findByDate(new Date(date));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.smiaOstieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSmiaOstieDto: UpdateSmiaOstieDto) {
    return this.smiaOstieService.update(+id, updateSmiaOstieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.smiaOstieService.remove(+id);
  }

  @Get('stats/week')
  getWeeklyStats(@Query('site') site: string) {
    return this.smiaOstieService.countByDayForCurrentWeek(site);
  }

}
