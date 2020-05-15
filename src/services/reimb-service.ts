import { Reimb } from "../models/reimb";
import { ReimbRepository } from "../repos/reimb-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../utils/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";


export class ReimbService {

    constructor(private reimbRepo: ReimbRepository) {
        this.reimbRepo = reimbRepo;
    }

    async getAllReimbs(): Promise<Reimb[]> {
        let reimbs = await this.reimbRepo.getAll();
        console.log("back to service", reimbs)
        if (reimbs.length == 0) {
            throw new ResourceNotFoundError();
        }

        return reimbs;

    }

    async getReimbById(id: number): Promise<Reimb> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let reimb = await this.reimbRepo.getById(id);

        if (isEmptyObject(reimb)) {
            throw new ResourceNotFoundError();
        }

        return reimb;

    }

    async getReimbByUniqueKey(queryObj: any): Promise<Reimb> {

        // we need to wrap this up in a try/catch in case errors are thrown for our awaits
        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Reimb))) {
                throw new BadRequestError();
            }

            // we will only support single param searches (for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            // if they are searching for a reimb by id, reuse the logic we already have
            if (key === 'REIMB_ID') {
                return await this.getReimbById(+val);
            }

            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let reimb = await this.reimbRepo.getReimbByUniqueKey(key, val);

            if (isEmptyObject(reimb)) {
                throw new ResourceNotFoundError();
            }

            return reimb;

        } catch (e) {
            throw e;
        }
    }


    async addNewReimb(newReimb: Reimb): Promise<Reimb> {
        
        try {
            if (!isValidObject(newReimb, 'REIMB_ID')) {
                throw new BadRequestError('Invalid property values found in provided reimb.');
            }

            const persistedReimb = await this.reimbRepo.save(newReimb);

            return persistedReimb;

        } catch (e) {
            throw e
        }

    }

    async updateReimb(updatedReimb: Reimb): Promise<boolean> {
        console.log("im in the service");
        
        try {

            if (!isValidObject(updatedReimb)) {
                throw new BadRequestError('Invalid reimb provided (invalid values found).');
            }

            // let repo handle some of the other checking since we are still mocking db
            return await this.reimbRepo.update(updatedReimb);
        } catch (e) {
            throw e;
        }

    }

    async deleteById(id: number): Promise<boolean> {
        
        try {
            if (!isValidId(id)) {
                throw new BadRequestError();
            }
            return await this.reimbRepo.deleteById(id);
        } catch (e) {
            throw e;
        }

    }
}

