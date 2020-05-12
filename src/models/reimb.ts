export class Reimb{
    REIMB_ID: number;
    AMOUNT: number;
    SUBMITTED:Date;
    RESOLVED: Date;
    AUTHOR_ID: number;
    RESOLVER_ID: number;
    REIMB_STATUS_ID: number;
    REIMB_TYPE_ID: number;

    constructor(id: number, amt: number, sm: Date, rs: Date, auID: number, rsID: number, rmSID: number, rmTID:number){
        this.REIMB_ID = id;
        this.AMOUNT= amt;
        this.SUBMITTED = sm;
        this.RESOLVED = rs;
        this.AUTHOR_ID = auID;
        this.RESOLVER_ID = rsID;
        this.REIMB_STATUS_ID = rmSID;
        this.REIMB_TYPE_ID = rmTID;
    }

}