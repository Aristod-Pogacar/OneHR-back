import { IsString } from "class-validator";

export class CreateAdminDto {
    @IsString()
    password: string;

    @IsString()
    matricule: string;
}
