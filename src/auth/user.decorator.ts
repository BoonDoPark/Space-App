import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const AuthUser = createParamDecorator((data:string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
    return user['id'];
})