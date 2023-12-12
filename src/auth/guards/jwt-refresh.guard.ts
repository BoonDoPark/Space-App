import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {
    async canActivate(context: ExecutionContext): Promise<any> {
        return super.canActivate(context);
    }
}