import { IsOptional, IsString } from "class-validator";

export class CreateLeaveDto {
    @IsString()
    matricule: string;

    @IsString()
    leave_type: string;

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
