import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import puppeteer, { Page } from 'puppeteer';
import { Like, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { connect, delay } from "../function/function";
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

async function punchin(page: Page) {
  await page.mouse.click(870, 170);
  await delay(5000);
  await page.browser().close();
}

@Injectable()
export class EmployeeService {
  constructor(
    private readonly config: ConfigService,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) { }

  async paginate(page: number, limit: number, sit: string, search: string = '') {
    const skip = (page - 1) * limit;

    const [data, total] = await this.employeeRepo.findAndCount({
      skip: skip,
      take: limit,
      where: [{
        site: sit,
        fullname: Like('%' + search + '%')
      },{
        site: sit,
        matricule: Like('%' + search + '%')
      },{
        site: sit,
        occupation: Like('%' + search + '%')
      },{
        site: sit,
        departement: Like('%' + search + '%')
      }]
    });

    const aquarelleCount = await this.employeeRepo.count({
      where: {
        site: "RABE"
      }
    });

    const lagunaCount = await this.employeeRepo.count({
      where: {
        site: "LAG"
      }
    });

    const tanaCount = await this.employeeRepo.count({
      where: {
        site: "TANA"
      }
    });

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      aquarelleCount,
      lagunaCount,
      tanaCount
    };
  }

  async punchIn(data: EmployeeDto) {
    const loginUrl = this.config.get<string>('LOGIN_URL');
    const username = data.matricule;
    const password = data.password;

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
        await punchin(page);
        // return {
        //   message: 'PunchIN effectué',
        // }
      }
    });
  }

  async hashCode(data: any) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hashSync(data.matricule, salt)
      return { "hashed": hashed }
  }

  async importFromExcel(file: Express.Multer.File) {
    if (file) {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows: any[] = XLSX.utils.sheet_to_json(worksheet);
      const salt = await bcrypt.genSalt(10);

      // 🎯 Sélectionner uniquement certains champs
      const filtered = rows.map(row => ({
        matricule: "AMAA" + row['Emp No'],
        division: row['Division'],
        sector: row['Sect'],
        departement: row['Dept'],
        line: row['Line'],
        gender: row['Gender'],
        fullname: row['Fullname'],
        occupation: row['Occupation'],
        site: row['Sit'],
        adress: row['Adrs street'] + " " + row['Adrs locality'],
        appPassword: bcrypt.hashSync("0000", salt)
      }));

      // ❗ ignorer lignes vides
      const cleanData = filtered.filter(x => x.matricule);

      // 📌 Insérer dans MySQL
      try {
        await this.employeeRepo
          .createQueryBuilder()
          .insert()
          .into(Employee)
          .values(cleanData)
          .orIgnore()  // ⚡ ignore les doublons automatiquement
          .execute();
      } catch (e) {
        console.log(e);
      }
      return {
        message: `${cleanData.length} lignes importées avec succès`,
        imported: cleanData.length,
      };
    } else {
      throw new BadRequestException('Aucun fichier reçu');
    }
  }

  create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepo.create(createEmployeeDto);
    console.log("Employee created:", employee);

    return employee;
  }

  async findAll() {
    const allEmployee = this.employeeRepo.find();
    console.log("finding all employees:", (await allEmployee).length);
    return allEmployee;
  }

  findOne(matricule: string) {
    console.log("finding employee with matricule:", matricule);
    const employee = this.employeeRepo.findOne({ where: { matricule } });
    console.log("Employee:", employee);
    return employee
    
  }

  update(matricule: string, updateEmployeeDto: UpdateEmployeeDto) {
    console.log("updating employee with matricule:", matricule);
    return this.employeeRepo.update(matricule, updateEmployeeDto);
  }

  remove(matricule: string) {
    console.log("deleting employee with matricule:", matricule);
    return this.employeeRepo.delete(matricule);
  }

  async search(q: string) {
    if (!q) return [];
    const [data] = await this.employeeRepo
      .createQueryBuilder('e')
      .leftJoin('users', 'u', 'u.employee = e.matricule')
      .where(
        'e.matricule LIKE :q OR e.fullname LIKE :q',
        { q: `%${q}%` },
      )
      .andWhere('u.id IS NULL')
      .select(['e.matricule', 'e.fullname'])
      .take(10)
      .getManyAndCount();
    console.log("Data:", data);  
    return data;
  }
}
