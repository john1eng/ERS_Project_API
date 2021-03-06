/**
 * connect to the endpoint to authorize the user before he/she allows to access to other endpoints that
 * is guarded by the middleware
 */
import express from 'express';
import AppConfig from '../config/app';
import { Principal } from '../dtos/principal';

export const AuthRouter = express.Router();

const userService = AppConfig.userService;

AuthRouter.get('', (req, resp) => {
    delete req.session.principal;
    resp.status(204).send();
});

AuthRouter.post('', async (req, resp) => {

    try {

        const { username, password } = req.body;
        let authUser = await userService.authenticateUser(username, password);
        let payload = new Principal(authUser.ERS_USER_ID, authUser.USERNAME, authUser.ROLE_NAME);
        req.session.principal = payload;
        resp.status(200).json(payload);
        
    } catch (e) {
        resp.status(e.statusCode || 500).json(e);
    }

    resp.send();

});