/**
 * this middleware provide a guard to unauthorize client to make use of the endpoints
 */
import { Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../errors/errors";

export const adminGuard = (req: Request, resp: Response, next) => {
    console.log("im in auth-middleware")
    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'ADMIN') {
        next();
    } else {
        console.log(req.session.principal.role)
        resp.status(403).json(new AuthorizationError());
    }

}

export const employGuard = (req: Request, resp: Response, next) => {
    console.log("im in auth-middleware")
    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'EMPLOYEE') {
        next();
    } else {
        console.log(req.session.principal.role)
        resp.status(403).json(new AuthorizationError());
    }

}

export const FinanceGuard = (req: Request, resp: Response, next) => {
    console.log("im in auth-middleware")
    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'Finance Manager') {
        next();
    } else {
        console.log(req.session.principal.role)
        resp.status(403).json(new AuthorizationError());
    }

}