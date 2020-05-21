/**
 * connect to the /emplReimbs endpoint to implement the CRUD functionality
 */
import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../utils/validator';
import { ParsedUrlQuery } from 'querystring';
import { employGuard } from '../middleware/auth-middleware';

export const EmplReimbRouter = express.Router();

const emplReimbService = AppConfig.emplReimbService;

EmplReimbRouter.get('', employGuard, async (req, resp) =>{
    console.log('im in get method for emplReimb')
    try{
        let reqURL = url.parse(req.url, true);
        //what is ParsedURLQUERY for
        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)){
            let payload = await emplReimbService.getEmplReimbByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        }else{
            console.log("Im about to invoke emplReimbService.getAllemplReimbs()")
            let payload = await emplReimbService.getAllEmplReimbs();
            resp.status(200).json(payload);
        }
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

EmplReimbRouter.get('/:username', async (req, resp) => {
    console.log('im in router of getEmplReimbByUserName')
    const username = req.params.username;
    try {
        let payload = await emplReimbService.getEmplReimbByUserName(username);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

EmplReimbRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await emplReimbService.getEmplReimbById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

EmplReimbRouter.post('', async (req, resp) => {
    console.log('POST REQUEST RECEIVED AT /emplReimbs');
    console.log(req.body);
    try {
        let newemplReimb = await emplReimbService.addNewEmplReimb(req.body);
        return resp.status(201).json(newemplReimb);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

EmplReimbRouter.patch('', async (req, resp) => {

	console.log('PATCH REQUEST RECEIVED AT /emplReimbs');
	try {
		let updemplReimb = await emplReimbService.updateEmplReimb(req.body);
		return resp.status(200).json(updemplReimb);
	} catch (e) {
		return resp.status(e.statusCode).json(e);
	}

});

EmplReimbRouter.delete('', async (req, resp) => {
    console.log("Im in the router.")

	console.log('DELETE REQUEST RECEIVED AT /emplReimbs');
	try {
		let delemplReimb = await emplReimbService.deleteById(req.body.REIMB_ID);
		return resp.status(204).json(delemplReimb);
	} catch (e) {
		return resp.status(e.statusCode).json(e);
	}

});