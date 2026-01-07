import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollDto } from './create-payroll.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {
    @IsString()
    email: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    employee: string;
}
