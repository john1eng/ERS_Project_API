/** 
 * model of user object to receive from the database
 */

export class User{
    ERS_USER_ID: number;
    USERNAME: string;
    PASSWORD: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    EMAIL: string
    ROLE_NAME: string;

    constructor(id: number, un: string, pw: string, fn: string, ln: string, em: string, role: string){
        this.ERS_USER_ID = id;
        this.USERNAME = un;
        this.PASSWORD = pw;
        this.FIRST_NAME = fn;
        this.LAST_NAME = ln;
        this.EMAIL = em;
        this.ROLE_NAME = role;
    }
}