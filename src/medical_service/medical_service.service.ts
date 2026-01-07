import { Injectable } from '@nestjs/common';
import { CreateMedicalServiceDto } from './dto/create-medical_service.dto';
import { UpdateMedicalServiceDto } from './dto/update-medical_service.dto';
import { MedicalService } from './entities/medical_service.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MedicalServiceService {
  constructor(

    @InjectRepository(MedicalService)
    private readonly medicalServiceRepo: Repository<MedicalService>,

  ) { }

  create(createMedicalServiceDto: CreateMedicalServiceDto) {
    return this.medicalServiceRepo.save(createMedicalServiceDto);
  }

  findAll() {
    return this.medicalServiceRepo.find();
  }

  findOne(id: number) {
    return this.medicalServiceRepo.findOne({ where: { id } });
  }

  update(id: number, updateMedicalServiceDto: UpdateMedicalServiceDto) {
    return this.medicalServiceRepo.update(id, updateMedicalServiceDto);
  }

  remove(id: number) {
    return this.medicalServiceRepo.delete(id);
  }

  async paginateMedicalService(
    search: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const query = this.medicalServiceRepo
      .createQueryBuilder('m');

    // 🔍 Filtre si un search est présent
    if (search && search.trim() !== '') {
      query.where('m.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query
      .orderBy('m.id', 'DESC')
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
}
