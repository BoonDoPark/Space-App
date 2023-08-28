import { IsNotEmpty } from "class-validator";

export class RefreshTokenDTO {
    @IsNotEmpty()
    refresh_token: string;
}