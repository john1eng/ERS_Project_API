export class User{
    ERS_USER_ID: number;
    USERNAME: string;
    PASSWORD: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    EMAIL: string
    USER_ROLE_ID: number;

    constructor(id: number, un: string, pw: string, fn: string, ln: string, em: string, role: number){
        this.ERS_USER_ID = id;
        this.USERNAME = un;
        this.PASSWORD = pw;
        this.FIRST_NAME = fn;
        this.LAST_NAME = ln;
        this.EMAIL = em;
        this.USER_ROLE_ID = role;
    }
}