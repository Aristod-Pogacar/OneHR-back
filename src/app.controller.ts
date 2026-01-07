import { Response } from 'express';
import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Req() req, @Res() res: Response) {
    return res.redirect("/views");
  }
}
