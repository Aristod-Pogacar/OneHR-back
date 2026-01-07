import { IsString } from "class-validator";

export class CreatePayrollDto {
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    employee: string;
}
