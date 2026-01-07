import { IsString } from "class-validator";

export class LeaveDto {
    @IsString()
    matricule: string;

    @IsString()
    password: string;

    @IsString()
    leave_type: string;

    @IsString()
    start_date: string;

    @IsString()
    end_date: string;

    @IsString()
    attach_file?: string; // chemin vers le fichier dans ton PC

    @IsString()
    comment: string;
}
