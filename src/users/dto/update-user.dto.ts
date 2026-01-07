import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    
  @IsEnum(UserRole)
  role: UserRole;

  @ValidateIf(dto => dto.role === UserRole.PAYROLL_OFFICER)
  @IsNotEmpty({ message: 'Email is required for Payroll Officer' })
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  matricule: string;

}
