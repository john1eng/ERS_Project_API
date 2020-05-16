/**
 * to validate the /users parameter and body from the routers and also to validate the info retreiving back
 * from the repositories
 */

import { User } from "../models/user";
import { UserRepository } from "../repos/user-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../utils/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";


export class UserService {

    constructor(private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    async getAllUsers(): Promise<User[]> {
        let users = await this.userRepo.getAll();
        console.log("back to service", users)
        if (users.length == 0) {
            throw new ResourceNotFoundError();
        }

        return users.map(this.removePassword);

    }

    async getUserById(id: number): Promise<User> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let user = await this.userRepo.getById(id);

        if (isEmptyObject(user)) {
            throw new ResourceNotFoundError();
        }

        return this.removePassword(user);

    }

    async getUserByUniqueKey(queryObj: any): Promise<User> {

        // we need to wrap this up in a try/catch in case errors are thrown for our awaits
        try {
            console.log('I am in getUserByUniqueKey() service');
            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key.toUpperCase(), User))) {
                throw new BadRequestError();
            }

            // we will only support single param searches (for now)
            let key = queryKeys[0];
            let val = queryObj[key];
            console.log('Did it get here\n', val);
            // if they are searching for a user by id, reuse the logic we already have
            if (key === 'ERS_USER_ID') {
                return await this.getUserById(+val);
            }

            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let user = await this.userRepo.getUserByUniqueKey(key, val);
            
            if (isEmptyObject(user)) {
                throw new ResourceNotFoundError();
            }

            return this.removePassword(user);

        } catch (e) {
            throw e;
        }
    }

    async authenticateUser(un: string, pw: string): Promise<User> {

        try {

            if (!isValidStrings(un, pw)) {
                throw new BadRequestError();
            }

            let authUser: User;
            
            authUser = await this.userRepo.getUserByCredentials(un, pw);
           

            if (isEmptyObject(authUser)) {
                throw new AuthenticationError('Bad credentials provided.');
            }

            return this.removePassword(authUser);

        } catch (e) {
            throw e;
        }

    }

    async addNewUser(newUser: User): Promise<User> {
        
        try {
            console.log('im in addnewuser service')
            console.log(newUser)
            if (!isValidObject(newUser, 'ERS_USER_ID')) {
                throw new BadRequestError('Invalid property values found in provided user.');
            }

            let usernameAvailable = await this.isUsernameAvailable(newUser.USERNAME);

            if (!usernameAvailable) {
                throw new ResourcePersistenceError('The provided username is already taken.');
            }
        
            let emailAvailable = await this.isEmailAvailable(newUser.EMAIL);
    
            if (!emailAvailable) {
                throw new  ResourcePersistenceError('The provided email is already taken.');
            }

            const persistedUser = await this.userRepo.save(newUser);

            return this.removePassword(persistedUser);

        } catch (e) {
            throw e
        }

    }

    async updateUser(updatedUser: User): Promise<boolean> {
        console.log("im in the service");
        
        try {

            if (!isValidObject(updatedUser)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            // let repo handle some of the other checking since we are still mocking db
            return await this.userRepo.update(updatedUser);
        } catch (e) {
            throw e;
        }

    }

    async deleteById(id: number): Promise<boolean> {
        
        try {
            if (!isValidId(id)) {
                throw new BadRequestError();
            }
            return await this.userRepo.deleteById(id);
        } catch (e) {
            throw e;
        }

    }

    private async isUsernameAvailable(username: string): Promise<boolean> {

        try {
            await this.getUserByUniqueKey({'USERNAME': username});
        } catch (e) {
            console.log('username is available')
            return true;
        }

        console.log('username is unavailable')
        return false;

    }

    private async isEmailAvailable(email: string): Promise<boolean> {
        
        try {
            await this.getUserByUniqueKey({'EMAIL': email});
        } catch (e) {
            console.log('email is available')
            return true;
        }

        console.log('email is unavailable')
        return false;
    }

    private removePassword(user: User): User {
        if(!user || !user.PASSWORD) return user;
        let usr = {...user};
        delete usr.PASSWORD;
        return usr;   
    }

}