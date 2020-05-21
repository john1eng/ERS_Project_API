/**
 * to validate the /emplReimbs parameter and body from the routers and also to validate the info retreiving back
 * from the repositories
 */
import { Reimb } from "../models/Reimb";
import { EmplReimbRepository } from "../repos/emplReimb-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../utils/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";


export class EmplReimbService {

    constructor(private emplReimbRepo: EmplReimbRepository) {
        this.emplReimbRepo = emplReimbRepo;
    }

    async getAllEmplReimbs(): Promise<Reimb[]> {
        console.log('am in getAllEmplReimbs service')
        let emplReimbs = await this.emplReimbRepo.getAll();
        console.log("back to service", emplReimbs)
        if (emplReimbs.length == 0) {
            throw new ResourceNotFoundError();
        }

        return emplReimbs;

    }

    async getEmplReimbById(id: number): Promise<Reimb> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let emplReimb = await this.emplReimbRepo.getById(id);

        if (isEmptyObject(emplReimb)) {
            throw new ResourceNotFoundError();
        }

        return emplReimb;
    }

    async getEmplReimbByUserName(username: string): Promise<Reimb[]> {

        console.log('im in service of getEmplReimbByUserName', username)
        if(!isValidStrings(username)) {
            throw new BadRequestError();
        }
        console.log('im after the validstring check', username)
        let emplReimb = await this.emplReimbRepo.getByUserName(username);
        
        if (isEmptyObject(emplReimb)) {
            throw new ResourceNotFoundError();
        }

        return emplReimb;
    }



    async getEmplReimbByUniqueKey(queryObj: any): Promise<Reimb[]> {

        // we need to wrap this up in a try/catch in case errors are thrown for our awaits
        try {
            console.log('i\'m in getEmplReimbByUniqueKey', queryObj)
            let queryKeys = Object.keys(queryObj);

            // if(!queryKeys.every(key => isPropertyOf(key, EmplReimb))) {
            //     throw new BadRequestError();
            // }

            // we will only support single param searches (for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            // if they are searching for a emplReimb by id, reuse the logic we already have
            // if (key === 'REIMB_ID') {
            //     return await this.getEmplReimbById(+val);
            // }

            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let emplReimb = await this.emplReimbRepo.getEmplReimbByUniqueKey(key, val);

            if (isEmptyObject(emplReimb)) {
                throw new ResourceNotFoundError();
            }

            return emplReimb;

        } catch (e) {
            throw e;
        }
    }


    async addNewEmplReimb(newEmplReimb: Reimb): Promise<Reimb> {
        
        try {
            console.log('im in addnewEmplReimb service')
            console.log(newEmplReimb)
                        //I'm not sure y isValidObject is not working
                        //IT DOESN'T WORK IF OBJECT HAS NULL VALUES
            if (!isValidObject(newEmplReimb, 'AMOUNT')) {
                console.log('this is showing an invalid object')
                throw new BadRequestError('Invalid property values found in provided emplReimb.');
            }

            const persistedEmplReimb = await this.emplReimbRepo.save(newEmplReimb);

            return persistedEmplReimb;

        } catch (e) {
            throw e
        }

    }

    async updateEmplReimb(updatedEmplReimb: Reimb): Promise<boolean> {
        console.log("im in the service");
        
        try {

            if (!isValidObject(updatedEmplReimb)) {
                throw new BadRequestError('Invalid emplReimb provided (invalid values found).');
            }

            // let repo handle some of the other checking since we are still mocking db
            return await this.emplReimbRepo.update(updatedEmplReimb);
        } catch (e) {
            throw e;
        }

    }

    async deleteById(id: number): Promise<boolean> {
        console.log(id)
        try {
            if (!isValidId(id)) {
                throw new BadRequestError();
            }
            return await this.emplReimbRepo.deleteById(id);
        } catch (e) {
            throw e;
        }
    }
}

