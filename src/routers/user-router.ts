import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../utils/validator';
import { ParsedUrlQuery } from 'querystring';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('', async (req, resp) =>{

    try{
        console.log("Im in the router.")
        let reqURL = url.parse(req.url, true);
        //what is ParsedURLQUERY for
        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)){
            let payload = await userService.getUserByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        }else{
            let payload = await userService.getAllUsers();
            resp.status(200).json(payload);
        }
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});