import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { Between, Repository } from 'typeorm';
import { CreateSmiaOstieDto } from './dto/create-smia_ostie.dto';
import { UpdateSmiaOstieDto } from './dto/update-smia_ostie.dto';
import { SmiaOstie } from './entities/smia_ostie.entity';

@Injectable()
export class SmiaOstieService {
  constructor(
    private readonly config: ConfigService,

    @InjectRepository(SmiaOstie)
    private readonly SmiaOstieRepo: Repository<SmiaOstie>,

    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) { }

  private getWeekRange() {
    const now = new Date();

    const day = now.getDay(); // 0 = dimanche
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { monday, sunday };
  }

  async countByDayForCurrentWeek(site: string) {
    const { monday, sunday } = this.getWeekRange();

    const raw = await this.SmiaOstieRepo
      .createQueryBuilder('s')
      .leftJoin('s.employee', 'e')
      .select('DAYOFWEEK(s.date_at)', 'day') // 1 = dimanche
      .addSelect('COUNT(*)', 'count')
      .where('s.date_at BETWEEN :monday AND :sunday', { monday, sunday })
      .andWhere('e.site = :site', { site })
      .groupBy('day')
      .getRawMany();

    // Initialiser lundi → dimanche
    const result = [0, 0, 0, 0, 0, 0, 0];

    raw.forEach(r => {
      const mysqlDay = Number(r.day); // 1..7 (dimanche..samedi)
      const index = mysqlDay === 1 ? 6 : mysqlDay - 2;
      result[index] = Number(r.count);
    });

    return result;
  }

  async create(createSmiaOstieDto: CreateSmiaOstieDto) {
    const employee = await this.employeeRepo.findOne({ where: { matricule: createSmiaOstieDto.employee } });

    if (!employee) {
      return {
        "status": "error",
        "message": "Matricule introuvable"
      };
    }
    const date = createSmiaOstieDto.date
      ? new Date(createSmiaOstieDto.date)
      : new Date();

    date.setHours(0, 0, 0, 0);

    const existingSmiaOstie = await this.SmiaOstieRepo.findOne({
      where: {
        employee: { matricule: createSmiaOstieDto.employee },
        date: date,
      },
    });

    if (existingSmiaOstie) {
      return {
        "status": "error",
        "message": "L'employé est déjà inscrit pour cette date."
      };
    }


    const smia = await this.SmiaOstieRepo.create({
      ...createSmiaOstieDto,
      employee,
    });

    return await this.SmiaOstieRepo.save(smia);
  }

  async findAll() {
    return await this.SmiaOstieRepo.find();
  }

  async findOne(id: number) {
    return await this.SmiaOstieRepo.findOne({ where: { id } });
  }

async update(id: number, updateSmiaOstieDto: UpdateSmiaOstieDto) {
  let employeeEntity = null;

  // Si employee (matricule) est envoyé, alors on le remplace par l'entité
  if (updateSmiaOstieDto.employee) {
    employeeEntity = await this.employeeRepo.findOne({
      where: { matricule: updateSmiaOstieDto.employee },
    });

    if (!employeeEntity) {
      throw new NotFoundException("Matricule introuvable");
    }
  }

  // On crée l'objet update
  const updatePayload: any = {
    ...updateSmiaOstieDto,
  };

  // Si employeeEntity existe, on remplace l'employee par l'entité
  if (employeeEntity) {
    updatePayload.employee = employeeEntity;
  }

  return this.SmiaOstieRepo.update(id, updatePayload);
}

  async remove(id: number) {
    return await this.SmiaOstieRepo.delete(id);
  }

  async findByDateDoingToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of today
    console.log('TODAY:', today);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to the beginning of tomorrow
    console.log('TOMORROW:', tomorrow);

    return this.SmiaOstieRepo.find({
      where: {
        date: Between(today, tomorrow),
      },
    });
  }

  async paginateToday(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [data, total] = await this.SmiaOstieRepo.findAndCount({
      where: {
        date_at: Between(todayStart, todayEnd), // ✅ ICI C'EST PROPRE
      },
      relations: ['employee'],
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async paginateHistory(date: string,search: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.SmiaOstieRepo
    .createQueryBuilder('m')
    .leftJoinAndSelect('m.employee', 'e')
    .where(
      '(e.matricule LIKE :search OR e.fullname LIKE :search OR e.departement LIKE :search OR m.reason LIKE :search)',
      { search: `%${search}%` },
    )
    .andWhere(date ? 'DATE(m.date_at) = :date' : '1=1', { date })
    .orderBy('m.date_at', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    console.log("startOfDay", startOfDay);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    console.log("endOfDay", endOfDay);

    return this.SmiaOstieRepo.find({
      where: {
        date: Between(startOfDay, endOfDay),
      },
    });
  }

  async countToday() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    return this.SmiaOstieRepo.count({
      where: {
        date: Between(startOfDay, endOfDay),
      },
    });
  }

}
