import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {

  @IsEnum(UserRole)
  role: UserRole;

  @ValidateIf(dto => dto.role === UserRole.PAYROLL_OFFICER)
  @IsNotEmpty({ message: 'Email is required for Payroll Officer' })
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  matricule: string;
}
