import { Injectable } from '@nestjs/common';
import { Permission2h } from './entities/permission2h.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreatePermission2hDto } from './dto/create-permission2h.dto';
import { UpdatePermission2hDto } from './dto/update-permission2h.dto';
import { Employee } from 'src/employee/entities/employee.entity';

import * as nodemailer from 'nodemailer';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

async function envoyerEmail(employee: Employee, permissionDetails: Permission2h, emailList: string[], emailAdress: string, emailPassword: string) {
  const today = new Date(permissionDetails.date);
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: emailAdress,
      pass: emailPassword
    }
  });

  const info = await transporter.sendMail({
    from: '"Stagiaire digital project" <'+ emailAdress +'>',
    to: emailList,
    subject: "Permission 2h: " + employee.fullname + " - " + today.getFullYear() + "/" + String(today.getMonth() + 1).padStart(2, "0") + "/" + String(today.getDate()).padStart(2, "0"),
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
        <p>
          Bonjour l'équipe Payroll,
        </p>
        <p>
          Nous souhaitons vous informer que l'employé(e) avec la matricule <strong>${employee.matricule} (${employee.fullname})</strong> a pris une permission de deux heures.
        </p>
        <p>
          <strong>
            Raison: ${permissionDetails.reason}<br>
            Heure de départ: ${permissionDetails.expectedStartTime}<br>
            Heure d'arrivé: ${permissionDetails.expectedEndTime}<br>
          </strong>
        </p>
        <p>
          Cordialement,<br>
          L'équipe RH
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p>
          Hello Payroll Team,
        </p>
        <p>
          We would like to inform you that the employee with matricule <strong>${employee.matricule} (${employee.fullname})</strong> has taken a two-hour leave.
        </p>
        <p>
          <strong>
            Reason: ${permissionDetails.reason}<br>
            Start time: ${permissionDetails.expectedStartTime}<br>
            End time: ${permissionDetails.expectedEndTime}<br>
          </strong>
        </p>
        <p>
          Best regards,<br>
          HR Team
        </p>
      </div>
    `

  });

  return {
    "status": "Email envoyé",
    "messageId": info.messageId };
}

@Injectable()
export class Permission2hService {
  
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Permission2h)
    private permission2hRepository: Repository<Permission2h>,
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    private readonly configService: ConfigService
  ) {
  }
  
  // async sendEmail(employee: Employee) {
    //   return await envoyerEmail(employee);
    // }

  async paginatePermission2h(
    search: string,
    page: number,
    limit: number,
    date: string,
  ) {
    const skip = (page - 1) * limit;

    const query = this.permission2hRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.employee', 'employee');

    // ✅ Recherche multi-champs sécurisée
    if (search) {
      query.where(
        `
        employee.matricule LIKE :search
        OR employee.fullname LIKE :search
        OR p.reason LIKE :search
        OR p.expectedStartTime LIKE :search
        OR p.expectedEndTime LIKE :search
        OR DATE(p.date) LIKE :search
        `,
        { search: `%${search}%` },
      );
    }

    if (date) {
      query.where('DATE(p.date) = :date', { date });
    }

    const [data, total] = await query
      .orderBy('p.date', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
  
  async create(dto: CreatePermission2hDto) {
    // 1. Récupérer l'employé correspondant au matricule
    const employee = await this.employeeRepository.findOne({
      where: { matricule: dto.employee },
    });

    if (!employee) {
      throw new Error(`Employee with matricule ${dto.employee} not found`);
    }

    // 2. Construire l'entité complète
    const entity = this.permission2hRepository.create({
      ...dto,
      employee,  // Remplacement du string par l'objet Employee
    });

    const payrollList = await this.userService.getUsersByRole(UserRole.PAYROLL_OFFICER);
    var email = [];
    for (let i = 0; i < payrollList.length; i++) {
      email.push(payrollList[i].email);
    }

    const emailAdress = this.configService.get<string>('EMAIL_ADRESS')
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD')

    await envoyerEmail(employee, entity, email, emailAdress, emailPassword);

    // 3. Enregistrer
    return await this.permission2hRepository.save(entity);
  }

  findAll() {
    return this.permission2hRepository.find();
  }

  findOne(id: number) {
    return this.permission2hRepository.findOne({ where: { id } });
  }

async update(id: number, dto: UpdatePermission2hDto) {
  // 1. Vérifier que la permission existe
  const permission = await this.permission2hRepository.findOne({
    where: { id },
  });

  if (!permission) {
    throw new Error(`Permission with id ${id} not found`);
  }

  // 2. S'il y a un employee dans le DTO → charger la relation
  let employee = permission.employee;

  if (dto.employee) {
    employee = await this.employeeRepository.findOne({
      where: { matricule: dto.employee },
    });

    if (!employee) {
      throw new Error(
        `Employee with matricule '${dto.employee}' not found`
      );
    }
  }

  // 3. Fusionner les valeurs déjà existantes avec les nouvelles
  const updated = this.permission2hRepository.merge(permission, {
    ...dto,
    employee, // relation mise à jour ou conservée
  });

  // 4. Sauvegarder
  return await this.permission2hRepository.save(updated);
}

  remove(id: number) {
    return this.permission2hRepository.delete(id);
  }

async countToday(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await this.permission2hRepository.count({
    where: {
      date: today,
    },
  });
}

}
