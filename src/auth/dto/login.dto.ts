import { IsEmail, IsNotEmpty } from "class-validator";

export interface loginDTO {
    email: string;
    password: string;
}

export class CreateUserDto {
    email: string;

    @IsNotEmpty()
    password: string;
}

export interface Payload {
    sub: number;
    email: string;
}

export interface LogoutDTO {
    id: number;
}