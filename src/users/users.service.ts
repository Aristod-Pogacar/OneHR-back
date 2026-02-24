import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { Employee } from 'src/employee/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) { }
  async create(dto: CreateUserDto) {

    if (
      dto.role === UserRole.PAYROLL_OFFICER &&
      !dto.email
    ) {
      throw new BadRequestException(
        'Email is required for Payroll Officer',
      );
    }

    const employee = await this.employeeRepo.findOneBy({
      matricule: dto.matricule,
    });

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    const existingUser = await this.userRepo.findOne({
      where: { employee: { matricule: dto.matricule } },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email ?? null,
      password: hashedPassword,
      role: dto.role,
      employee,
    });

    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password');
    }
    return user;

  }

  async getByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async login(email: string, password: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }

  async getByMatricule(matricule: string) {
    return this.userRepo.findOneBy({ employee: { matricule } });
  }

  async getByRole(role: UserRole) {
    return this.userRepo.find({ where: { role } });
  }

  async paginateUser(
    search: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    console.log("skip:", skip);

    const query = this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.employee', 'employee');

    // 🔍 Filtre si un search est présent
    if (search && search.trim() !== '') {
      query.where('u.employee.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query
      .orderBy('u.id', 'DESC')
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

  async getUsersByRole(role: UserRole) {
    return this.userRepo.find({
      where: { role },
      order: { id: 'DESC' },
    });
  }

  async findById(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async updatePassword(user: User, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepo.update(user.id, { password: hashedPassword });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async findHrAndPayrollBySameSite(employeeMatricule: string) {
    return this.userRepo
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.employee', 'e')
      .innerJoin(Employee, 'refEmp', 'refEmp.matricule = :matricule', {
        matricule: employeeMatricule,
      })
      .where('u.role IN (:...roles)', {
        roles: [UserRole.PAYROLL_OFFICER, UserRole.HR_ADMIN],
      })
      .andWhere('e.site = refEmp.site')
      .getMany();
  }

}
