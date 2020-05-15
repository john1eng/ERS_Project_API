import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../utils/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('', adminGuard, async (req, resp) =>{
    console.log('im in get method for user')
    try{
        let reqURL = url.parse(req.url, true);
        //what is ParsedURLQUERY for
        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)){
            let payload = await userService.getUserByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        }else{
            console.log("Im about to invoke userService.getAllUsers()")
            let payload = await userService.getAllUsers();
            resp.status(200).json(payload);
        }
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

UserRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await userService.getUserById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

UserRouter.post('', async (req, resp) => {
    console.log('POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await userService.addNewUser(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

UserRouter.patch('', async (req, resp) => {

	console.log('PATCH REQUEST RECEIVED AT /users');
	try {
		let updUser = await userService.updateUser(req.body);
		return resp.status(200).json(updUser);
	} catch (e) {
		return resp.status(e.statusCode).json(e);
	}

});

UserRouter.delete('', async (req, resp) => {
    console.log("Im in the router.")

	console.log('DELETE REQUEST RECEIVED AT /users');
	try {
		let delUser = await userService.deleteById(req.body.ERS_USER_ID);
		return resp.status(204).json(delUser);
	} catch (e) {
		return resp.status(e.statusCode).json(e);
	}

});