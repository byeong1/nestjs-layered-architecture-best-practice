import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

/**
 * base middleware for all middlewares
 *
 * @description
 * This middleware is used to test the base route
 */
@Injectable()
export abstract class BaseMiddleware implements NestMiddleware {
    public abstract use(req: Request, res: Response, next: NextFunction): void;
}
