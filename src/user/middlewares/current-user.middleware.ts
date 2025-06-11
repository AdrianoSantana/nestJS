import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../user.service";
import { User } from "../user.entity";

declare global {
   namespace Express {
      interface Request {
         currentUser?: User
      }
   }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UserService) {}

    public async use(req: Request, res: Response, next: NextFunction) {
       const userId = req.session?.userId

       if (userId) {
          const user = await this.usersService.findById(userId)
          req.currentUser = user != null ? user : undefined
       }
       next()
    }

}