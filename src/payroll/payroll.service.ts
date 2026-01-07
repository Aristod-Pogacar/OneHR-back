import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Employee } from 'src/employee/entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PayrollService {

    constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,

    @InjectRepository(Payroll)
    private payrollRepo: Repository<Payroll>,
  ) { }

  async create(createPayrollDto: CreatePayrollDto) {
    // Proposed implementation logic
    const password = await bcrypt.hash(createPayrollDto.password, 10);
    const newPayroll = await this.payrollRepo.create({
        ...createPayrollDto,
        employee: { matricule: createPayrollDto.employee },
        password: password
    });
    return this.payrollRepo.save(newPayroll);
  }

  findAll() {
    return this.payrollRepo.find();
  }

  findOne(id: number) {
    return this.payrollRepo.findOne({ where: { id }, relations: ['employee'] });
  }

  // update(id: number, updatePayrollDto: UpdatePayrollDto) {
  //   return this.payrollRepo.update(id, {
  //       ...updatePayrollDto,
  //       employee: { matricule: updatePayrollDto.employee },
  //       password: updatePayrollDto.password
  //   });
  // }
  async update(id: number, dto: UpdatePayrollDto) {
    const payroll = await this.payrollRepo.findOne({
      where: { id },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    Object.assign(payroll, dto);

    return await this.payrollRepo.save(payroll);
  }

  remove(id: number) {
    return this.payrollRepo.delete(id);
  }

  async paginatePayroll(
    search: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    console.log("skip:", skip);

    const query = this.payrollRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.employee', 'employee');

    // 🔍 Filtre si un search est présent
    if (search && search.trim() !== '') {
      query.where('p.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query
      .orderBy('p.id', 'DESC')
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

  async findByEmail(email: string) {
    return this.payrollRepo.findOne({
      where: { email }
    });
  }

}
