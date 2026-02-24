import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CryptoService } from 'src/crypto/crypto.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateLeaveDto } from 'src/leave/dto/create-leave.dto';
import { PuppeteerManagerService } from 'src/puppeteer-manager/puppeteer-manager.service';
import { PuppeteerService } from './puppeteer.service';

@Controller('bot')
export class PuppeteerController {
    constructor(
        private readonly manager: PuppeteerManagerService,
        private readonly bot: PuppeteerService,
        private readonly employeeService: EmployeeService,
        private cryptoService: CryptoService
    ) { }

    @Post('session')
    async createSession() {
        console.log("CREATING SESSION")
        const sessionId = await this.manager.createSession();
        return { sessionId };
    }

    @Post(':sessionId/start')
    start(@Param('sessionId') sessionId: string, @Res() res: Response) {
        console.log("START")
        return this.bot.start(sessionId, res);
    }

    @Post(':sessionId/login')
    async login(@Param('sessionId') sessionId: string, @Body() body: { username: string, encryptedPassword: string }, @Res() res: Response) {
        console.log("LOGIN")
        const decryptedPassword = await this.cryptoService.decrypt(body.encryptedPassword);
        console.log(decryptedPassword);
        return this.bot.login(sessionId, body.username, decryptedPassword, res);
    }

    @Post(':sessionId/leave')
    goToLeave(@Param('sessionId') sessionId: string, @Res() res: Response) {
        console.log("GO TO LEAVE")
        return this.bot.goToLeave(sessionId, res);
    }

    @Post(':sessionId/new-leave')
    goToNewLeave(@Param('sessionId') sessionId: string, @Res() res: Response) {
        console.log("GO TO NEW LEAVE")
        return this.bot.goToNewLeave(sessionId, res);
    }

    @Post(':sessionId/complete-form')
    completeForm(@Param('sessionId') sessionId: string, @Body() data: CreateLeaveDto, @Res() res: Response) {
        console.log("COMPLETE FORM")
        return this.bot.completeFormulaire(sessionId, data, res);
    }
    // @Post(':sessionId/leave')
    // goToLeave(@Param('sessionId') sessionId: string, @Body() createLeaveDto: CreateLeaveDto) {
    //     return this.bot.goToLeave(sessionId, createLeaveDto);
    // }

    @Delete(':sessionId')
    close(@Param('sessionId') sessionId: string) {
        console.log("DELETING SESSION")
        return this.manager.closeSession(sessionId);
    }
}
