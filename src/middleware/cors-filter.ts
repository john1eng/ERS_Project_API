/**
 * to enable cross-domain request between the client and the server
 * it allows restricted resources on a web page to be requested from another domain outside the domain
 * cross-domain is to allow two domain of different security to allow communication
 */
import { Request, Response } from "express";


export function corsFilter(req: Request, resp: Response, next) {

    resp.header('Access-Control-Allow-Origin', '*'); 
    resp.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    resp.header('Access-Control-Allow-Credentials', 'true');
    resp.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    // If this request is an OPTION request (aka "pre-flight request") send it back with a status of 200
    if (req.method === 'OPTIONS') {
        resp.sendStatus(200);
    } else {
        next(); // passes the req and resp objects to the next piece of middleware (or router).
    }


}