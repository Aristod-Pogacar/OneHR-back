import { IsString } from "class-validator";

export class EmployeeDto {
    @IsString()
    matricule: string;

    @IsString()
    password: string;
}
