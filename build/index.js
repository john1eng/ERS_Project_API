"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var user_router_1 = require("./routers/user-router");
var pg_1 = require("pg");
//environment configuration
dotenv_1.default.config();
//database configuration
exports.connectionPool = new pg_1.Pool({
    host: process.env['DB_HOST'],
    port: +process.env['DB_PORT'],
    database: process.env['DB_NAME'],
    user: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    max: 5
});
console.log(exports.connectionPool);
// logging configuration
fs_1.default.mkdir(__dirname + "/logs", function () { });
var logStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, 'logs/access.log'), { flags: 'a' });
//webserver configuration
var app = express_1.default();
var port = 3000;
app.use(morgan_1.default('combined', { stream: logStream }));
app.use('/', express_1.default.json());
app.use('/users', user_router_1.UserRouter);
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
app.listen(port, function () { return console.log("listening at http://localhost:" + port); });
