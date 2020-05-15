export class Reimb{
    REIMB_ID: number;
    AMOUNT: number;
    SUBMITTED:Date;
    RESOLVED: Date;
    DESCRIPTION: string;
    RECEIPT: string;
    AUTHOR_USERNAME: string;
    AUTHOR_FIRST_NAME: string;
    AUTHOR_LAST_NAME: string;
    RESOLVER_USERNAME: string;
    RESOLVER_FIRST_NAME: string;
    RESOLVER_LAST_NAME: string;
    REIMB_STATUS: string;
    REIMB_TYPE: string;

    constructor(id: number, amt: number, sm: Date, rs: Date, des: string, receipt: string, 
        author: string, author_fn: string, author_ln: string, 
        resolver: string, resolver_fn: string, resolver_ln: string,
        status: string, type: string){

        this.REIMB_ID = id;
        this.AMOUNT= amt;
        this.SUBMITTED = sm;
        this.RESOLVED = rs;
        this.DESCRIPTION = des;
        this.RECEIPT = receipt;
        this.AUTHOR_USERNAME = author;
        this.AUTHOR_FIRST_NAME = author_fn;
        this.AUTHOR_LAST_NAME = author_ln;
        this.RESOLVER_USERNAME = resolver;
        this.RESOLVER_FIRST_NAME = resolver_fn;
        this.RESOLVER_LAST_NAME = resolver_ln;
        this.REIMB_STATUS = status;
        this.REIMB_TYPE = type;
    }

}