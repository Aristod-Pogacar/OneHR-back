import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveDto } from './create-leave.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateLeaveDto extends PartialType(CreateLeaveDto) {
    @IsString()
    matricule: string;

    @IsString()
    @IsOptional()
    leave_type?: string;

    @IsString()
    start_date: string;

    @IsString()
    end_date: string;

    @IsString()
    @IsOptional()
    attach_file?: string; // chemin vers le fichier dans ton PC

    @IsString()
    comment: string;
}
