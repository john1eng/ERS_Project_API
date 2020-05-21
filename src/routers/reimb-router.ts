/**
 * connect to the /reimbs endpoint to implement the CRUD functionality
 */
import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../utils/validator';
import { ParsedUrlQuery } from 'querystring';
import { financeGuard } from '../middleware/auth-middleware';

export const ReimbRouter = express.Router();

const reimbService = AppConfig.reimbService;

ReimbRouter.get('', financeGuard, async (req, resp) =>{
    console.log('im in get method for reimb')
    try{
        let reqURL = url.parse(req.url, true);
        //what is ParsedURLQUERY for
        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)){
            let payload = await reimbService.getReimbByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        }else{
            console.log("Im about to invoke reimbService.getAllreimbs()")
            let payload = await reimbService.getAllReimbs();
            resp.status(200).json(payload);
        }
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

ReimbRouter.get('/:username', async (req, resp) => {
    console.log('im in router of getReimbByUserName')
    const username = req.params.username;
    try {
        let payload = await reimbService.getReimbByUserName(username);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await reimbService.getReimbById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbRouter.post('', async (req, resp) => {
    console.log('POST REQUEST RECEIVED AT /reimbs');
    console.log(req.body);
    try {
        let newreimb = await reimbService.addNewReimb(req.body);
        return resp.status(201).json(newreimb);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

ReimbRouter.patch('', async (req, resp) => {

	console.log('PATCH REQUEST RECEIVED AT /reimbs');
	try {
		let updreimb = await reimbService.updateReimb(req.body);
		return resp.status(200).json(updreimb);
	} catch (e) {
		return resp.status(e.statusCode).json(e);
	}

});

ReimbRouter.delete('', async (req, resp) => {
    console.log("Im in the router.")

	console.log('DELETE REQUEST RECEIVED AT /reimbs');
	try {
		let delreimb = await reimbService.deleteById(req.body.REIMB_ID);
		return resp.status(204).json(delreimb);
	} catch (e) {
		return resp.status(e.statusCode).json(e);
	}

});