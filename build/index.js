"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * initial stages
 * dotenv config to connect to the database
 * use logging
 * connecting the routers
 * create a listenning port when the application is run
 * connect to the middlewares - session, corsfilter
 */
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var user_router_1 = require("./routers/user-router");
var reimb_router_1 = require("./routers/reimb-router");
var auth_router_1 = require("./routers/auth-router");
var session_middleware_1 = require("./middleware/session-middleware");
var cors_filter_1 = require("./middleware/cors-filter");
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
var port = 8080;
app.use(morgan_1.default('combined', { stream: logStream }));
app.use(session_middleware_1.sessionMiddleware);
app.use(cors_filter_1.corsFilter);
app.use('/', express_1.default.json());
app.use('/users', user_router_1.UserRouter);
app.use('/reimbs', reimb_router_1.ReimbRouter);
app.use('/auth', auth_router_1.AuthRouter);
app.listen(port, function () { return console.log("listening at http://localhost:" + port); });
