import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UserService } from '../user.service';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const request = context.switchToHttp().getRequest();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const { userId } = request.session || {};

      if (!userId) {
        return next.handle();
      }

      const user = await this.userService.findById(userId as string);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.currentUser = user;

      return next.handle();
    } catch (error) {
      console.error(`CurrentUserInterceptor.intercept - ${error}`);
      return next.handle();
    }
  }
}
