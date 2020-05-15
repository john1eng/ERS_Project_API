export class Reimb{
    REIMB_ID: number;
    AMOUNT: number;
    SUBMITTED:Date;
    RESOLVED: Date;
    DESCRIPTION: string;
    RECEIPT: string;
    AUTHOR: string;
    RESOLVER: string;
    REIMB_STATUS: string;
    REIMB_TYPE: string;

    constructor(id: number, amt: number, sm: Date, rs: Date, des: string, receipt: string, author: string, resolver: string, status: string, type: string){
        this.REIMB_ID = id;
        this.AMOUNT= amt;
        this.SUBMITTED = sm;
        this.RESOLVED = rs;
        this.DESCRIPTION = des;
        this.RECEIPT = receipt;
        this.AUTHOR = author;
        this.RESOLVER = resolver;
        this.REIMB_STATUS = status;
        this.REIMB_TYPE = type;
    }

}