import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { CompareAdminDto } from './dto/compare-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly config: ConfigService,

    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) { }

  async create(createAdminDto: CreateAdminDto) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(createAdminDto.password, salt);

    const admin = await this.adminRepo.save({
      matricule: createAdminDto.matricule,
      password: hashed,
    });

    return { message: 'Admin saved', matricule: admin.matricule };
  }

  async compare(compareAdminDto: CompareAdminDto) {
      const admin = await this.adminRepo.findOne({ where: { matricule: compareAdminDto.matricule } })
      const compare = await bcrypt.compare(compareAdminDto.password, admin.password);
      
      return { "isAdmin": compare }
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    this.adminRepo.delete(id);
    return { message: 'Admin removed' };
  }
}
