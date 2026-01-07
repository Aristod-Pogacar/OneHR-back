import { IsString } from "class-validator";

export class CreateEmployeeDto {

    @IsString()
    matricule: string;

    @IsString()
    password: string;

    @IsString()
    division: string;

    @IsString()
    sector: string;

    @IsString()
    departement: string;

    @IsString()
    line: string;

    @IsString()
    gender: string;

    @IsString()
    fullname: string;

    @IsString()
    occupation: string;

    @IsString()
    site: string;

    @IsString()
    adress: string;

}
