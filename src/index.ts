import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import { UserRouter } from './routers/user-router'

import { Pool } from 'pg';

//environment configuration
dotenv.config();

//database configuration
export const connectionPool: Pool = new Pool({
    host: process.env['DB_HOST'],
    port: +process.env['DB_PORT'],
    database: process.env['DB_NAME'],
    user: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    max: 5
});

console.log(connectionPool);
// logging configuration
fs.mkdir(`${__dirname}/logs`, () => {});
const logStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });

//webserver configuration
const app = express();
const port = 3000;

app.use(morgan('combined', { stream: logStream }));
app.use('/', express.json());
app.use('/users', UserRouter);
// let client: PoolClient;

// try{
// client = await connectionPool.connect();
// console.log("----------------------");
// console.log(client);
// let sql = `select * from ers_reimbursement;`;
// let payload = client.query(sql);
// resp.status(200).json(payload);
// }catch(e){
//     console.log(e);
// }finally {
//     client && client.release();
// }

// });

app.listen(port, () => console.log(`listening at http://localhost:${port}`))