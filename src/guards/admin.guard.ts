import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AdminGuard implements CanActivate {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        const user = request.currentUser
        if (!user) return false

        if (user.isAdmin) {
            return true
        } else {
             throw  {
                message: 'User has not access to this route',
                statusCode: 403,
                error: 'Unauthorized'
            }
        }
    }
}