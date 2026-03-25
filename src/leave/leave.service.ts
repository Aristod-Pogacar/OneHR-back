import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import puppeteer, { Page } from "puppeteer";
import { Employee } from "src/employee/entities/employee.entity";
import { Between, Repository } from "typeorm";
import { connect, delay, setDate } from "../function/function";
import { CreateLeaveDto } from "./dto/create-leave.dto";
import { UpdateLeaveDto } from "./dto/update-leave.dto";
import { Leave } from "./entities/leave.entity";
import { CryptoService } from 'src/crypto/crypto.service';

const leaveTypeLocation = {
  Indisponibilite_AMD: { x: 140, y: 300 },
  Local_Leave_AMD: { x: 140, y: 340 },
  Permission_AMD: { x: 140, y: 420 },
}

async function newLeave(page: Page, btn_new_leave: boolean, form: boolean, inactivity_timeout: number, startDate: string, endDate: string, comment: string, leave_type: string) {
  const leaveLocation = leaveTypeLocation[leave_type];
  let inactivityTimer;
  try {

    const newPagePromise = new Promise<Page>(resolve =>
      page.browser().once('targetcreated', async target => {
        const newPage = await target.page();
        resolve(newPage);
      })
    );

    // await page.mouse.move(40, 210)
    await page.mouse.click(340, 460);
    // await delay(2000);
    const newPage: Page = await newPagePromise;
    await delay(2000);
    // await page.mouse.click(370, 250);
    await delay(2000);
    console.log("🕒 Navigation vers Congé...");
    let isRunning = false;
    newPage.on("console", async (msg: any) => {

      if (isRunning) return;     // ⛔ Empêche la ré-entrée
      isRunning = true;          // 🔒 On lock

      try {
        console.log('💬 Console:', msg.text());
        // Reset du timer
        clearTimeout(inactivityTimer);

        // Recréer un timer qui déclenchera l'action après période d'inactivité
        inactivityTimer = setTimeout(async () => {
          try {

            console.log("⏳ Plus aucun message console → on continue");

            // === Ton action ici ===
            if (!btn_new_leave) {
              await newPage.waitForSelector('button.btn.btn-default', { visible: true });
              await newPage.evaluate(() => {
                const btn = [...document.querySelectorAll('button.btn.btn-default')]
                  .find(b => b.textContent.trim() === 'New Leave') as HTMLButtonElement | undefined;
                if (btn) { btn.click(); };
              });
            }

            if (!form) {
              console.log("WE NEED TO COMPLETE FORMS !!!!");
              await delay(2000);
              // await newPage.$eval('#leaveComment', el => el.value = '');

              await newPage.waitForSelector('input[placeholder="Comment"]', { visible: true });
              await newPage.evaluate(() => {
                const el: HTMLInputElement = document.querySelector('input[placeholder="Comment"]');
                el.value = "";
                el.dispatchEvent(new Event('input', { bubbles: true }));
              });
              console.log('comment =', comment, [typeof comment]);
              await newPage.type('input[placeholder="Comment"]', String(comment ?? ''), { delay: 100 });

              await delay(2000);
              await newPage.mouse.click(160, 240)
              await delay(2000);
              await newPage.mouse.click(leaveLocation.x, leaveLocation.y)
              await delay(2000);
              // await page.click('#startDate');
              console.log("STARTING DATE NOW !!!");
              // await setDate(newPage,"#startDate", '11/13/2025')
              await setDate(newPage, "#startDate", startDate)
              await delay(2000);
              console.log("ENDING DATE NOW !!!");
              await setDate(newPage, "#endDate", endDate)
              await delay(4000);

              const fileInputs = await newPage.$$('input[type="file"]');

              console.log("Nombre de champs file trouvés:", fileInputs.length);

              if (fileInputs.length === 0) {
                throw new Error("Aucun champ file détecté");
              }

              await fileInputs[0].uploadFile("D:/Aquarelle/aqua-project/one-hr-back/punch-in.png");
              // await newPage.click('button[title="Submit"]');
              // D:/Aquarelle/aqua-project/one-hr-back/punch-in.png
              form = true;
              await delay(4000);
              console.log("✅ Bouton 'New Leave' cliqué");
              // await newPage.click('button[title="Submit"]');
              await delay(3000);
              console.log("1- ✅ Bouton 'Submit' cliqué");
              await delay(3000);
              console.log("1- ✅ Bouton 'Submit' cliqué");
              await delay(3000);
              console.log("1- ✅ Bouton 'Submit' cliqué");

              // await newPage.browser().close();
              return;
            } else {
              console.log("form:", form);
            }
            // await newPage.browser().close();
          } finally {
            await newPage.browser().close();
            console.log("isRunning = false");
            isRunning = false;      // 🔓 On unlock
          }

        }, inactivity_timeout);

      } catch (error) {
        console.error(error);
        isRunning = false;
      }
    });
  } catch (error) {
    console.log("error:", error);
    return {
      success: false,
      code: error.code || "UNKNOWN_ERROR",
      message: error.message
    }
  }
}

@Injectable()
export class LeaveService {
  constructor(
    private readonly config: ConfigService,

    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,

    @InjectRepository(Leave)
    private leaveRepo: Repository<Leave>,
    private cryptoService: CryptoService
  ) { }

  async postLeave(data: CreateLeaveDto, password: string) {
    console.log(data);

    const loginUrl = this.config.get<string>('LOGIN_URL');
    const username = data.matricule;
    const inactivity_timeout = 5000;

    let btn_new_leave = false;
    let form = false;

    const browser = await puppeteer.launch({
      headless: false, // true si tu veux en arrière-plan
      defaultViewport: null,
      userDataDir: "./one-hr",
    });

    const page = await browser.newPage();
    await page.setCacheEnabled(true);
    await connect(page, loginUrl, username, password);

    // Aller sur la page Punch In (tu peux adapter l’URL si besoin)
    console.log("🕒 Navigation vers Punch In...");

    page.on("console", async (msg) => {
      const text = msg.text();
      console.log("[Console] →", text);

      // Si le message contient "_getErrorMessage()"
      if (text.includes("_getErrorMessage()")) {
        await delay(5000);
        await newLeave(page, btn_new_leave, form, inactivity_timeout, data.start_date, data.end_date, data.comment, data.leave_type);
        return {
          succes: true,
          received: data,
        }
      }
    });
  }

  async doneLeave(leave: Leave) {
    leave.done = true;
    leave.successAt = new Date();
    await this.leaveRepo.save(leave);
    return leave;
  }

  async findLeavesNotDone() {
    return this.leaveRepo.find({ where: { done: false } });
  }

  async create(createLeaveDto: CreateLeaveDto) {
    // console.log(createLeaveDto);

    try {

      const employ = await this.employeeRepo.findOne({
        where: { matricule: createLeaveDto.matricule },
      });
      console.log("EMPLOYEE PASSWORD:", employ.password);
      const password = this.cryptoService.decrypt(employ.password);
      console.log("PASSWORD:", password);

      await this.postLeave(createLeaveDto, password);
      const leaveType = leaveTypeLocation[createLeaveDto.leave_type];
      console.log("leaveType:", createLeaveDto.leave_type, [leaveType]);
      // return leaveType
      // return createLeaveDto;
      const leave = this.leaveRepo.create(createLeaveDto);
      leave.employee = employ;
      return this.leaveRepo.save(leave);
    } catch (error) {
      console.log("error:", error);
      return {
        success: false,
        code: error.code || "UNKNOWN_ERROR",
        message: error.message
      };
    }
  }

  findAll() {
    return this.leaveRepo.find();
  }

  async findOne(matricule: string) {
    var employee = await this.employeeRepo.findOne({
      where: { matricule: matricule },
    });
    console.log(employee);

    return this.leaveRepo.findOne({ where: { employee: employee } });
  }

  update(id: number, updateLeaveDto: UpdateLeaveDto) {
    return this.leaveRepo.update(id, updateLeaveDto);
  }

  remove(id: number) {
    return this.leaveRepo.delete(id);
  }


  async paginateLocalLeave(
    search: string,
    page: number,
    limit: number,
    leaveType?: string,
  ) {
    const skip = (page - 1) * limit;

    const query = this.leaveRepo
      .createQueryBuilder('leave')
      .leftJoinAndSelect('leave.employee', 'employee');

    // ✅ Recherche texte
    if (search) {
      query.where(
        `
      employee.matricule LIKE :search
      OR employee.fullname LIKE :search
      OR leave.start_date LIKE :search
      OR leave.end_date LIKE :search
      `,
        { search: `%${search}%` },
      );
    }

    // ✅ Filtre par type de congé
    if (leaveType) {
      query.andWhere('leave.leave_type = :leaveType', { leaveType });
    }

    const [data, total] = await query
      .orderBy('leave.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  countDays(start: string, end: string): number {
    const startDate = this.parseDate(start);
    const endDate = this.parseDate(end);

    const diff = endDate.getTime() - startDate.getTime();

    const days = diff / (1000 * 60 * 60 * 24) + 1; // +1 car inclusif

    return days;
  }

  parseDate(dateStr: string): Date {
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  async countEmployeeLeaveDays(matricule: string, leave_type: string, year: number) {
    const leaves = await this.leaveRepo.find({
      where: {
        employee: { matricule },
        leave_type
      },
    });

    let total = 0;

    for (const leave of leaves) {
      const start = this.parseDate(leave.start_date);
      const end = this.parseDate(leave.end_date);

      if (start.getFullYear() === year || end.getFullYear() === year) {
        total += this.countDays(leave.start_date, leave.end_date);
      }
    }

    return total;
  }

  async isLeaveAvailable(matricule: string, start: string, end: string) {
    const newStart = this.parseDate(start);
    const newEnd = this.parseDate(end);

    const leaves = await this.leaveRepo.find({
      where: {
        employee: { matricule },
      },
    });

    for (const leave of leaves) {
      const existingStart = this.parseDate(leave.start_date);
      const existingEnd = this.parseDate(leave.end_date);

      if (newStart <= existingEnd && newEnd >= existingStart) {
        return false; // conflit
      }
    }

    return true;
  }

  async countToday() {
    const today = new Date().toISOString().split('T')[0];
    const { count } = await this.leaveRepo
      .createQueryBuilder('leave')
      .where('leave.start_date <= :today', { today })
      .andWhere('leave.end_date >= :today', { today })
      .select('COUNT(leave.id)', 'count')
      .getRawOne();

    return parseInt(count, 10);
  }
  async getEmployeeLeavesForMonth(
    matricule: string,
    year: number,
    month: number
  ) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = new Date(year, month, 0)
      .toISOString()
      .split('T')[0];

    return this.leaveRepo
      .createQueryBuilder('l')
      .where('l.employee.matricule = :matricule', { matricule })
      .andWhere(`
      STR_TO_DATE(l.start_date, '%c/%e/%Y') <= :end
    `, { end })
      .andWhere(`
      STR_TO_DATE(l.end_date, '%c/%e/%Y') >= :start
    `, { start })
      .getMany();
  }

  async save(data: CreateLeaveDto) {
    const employee = await this.employeeRepo.findOne({
      where: { matricule: data.matricule },
    });
    const leave = this.leaveRepo.create(data);
    leave.employee = employee;
    return this.leaveRepo.save(leave);
  }

}
