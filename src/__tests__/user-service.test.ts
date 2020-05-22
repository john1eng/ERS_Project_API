import { UserService } from '../../build/services/user-service';
import { User } from '../../build/models/user';
import Validator from '../../build/utils/validator';
import {ResourceNotFoundError, BadRequestError } from '../../build/errors/errors';
import { isJSDocUnknownType } from 'typescript';

//create a mock implementation for all the functions in userRepository
jest.mock('../repos/user-repo', () => {
    return new class UserRepository{
        getAll = jest.fn();
        getById = jest.fn();
        getUserByUniqueKey = jest.fn();
        getUserByCredentials = jest.fn();
        save = jest.fn();
        update = jest.fn();
        deleteById = jest.fn();
    }
});


describe('userService', ()=> {

    let sut;
    let mockRepo;

    //mock samples
    let mockUsers = [
        new User(1,'john1eng','password','John','Eng','john234@yahoo.com','employee'),
        new User(2,'Joel1Bell','password','Joel','Bell','alfieopen-minded@outlook.com','employee'),
        new User(3, 'Christopher1Doyle','password','Christopher','Doyle','cystalker@optonline.net','employee'),
        new User(4, 'Gary1Timberlake','password','Gary','Timberlake','ginnybrooding@gmail.com','employee'),
        new User(5, 'Liam1Ryan','password','Liam','Ryan','awkwardmo@live.com','employee')
    ];

    //is this for passing mockRepo to the service repos
    beforeEach(() => {
        mockRepo = jest.fn(()=> {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getUserByUniqueKey: jest.fn(),
                getUserByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            }
        });
        //it look look like passing mockRepo which is the mock implementation of repository into UserService
        //it it to instantiate ?
        //@ts-ignore
        sut = new UserService(mockRepo);
    });
    test('should resolve to User[] (without passwords) when getAllUsers() successfully retrieves users from the data source', async () => {

        //getAll takes in will return the value of mockUsers data
        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);

        // Act
        let result = await sut.getAllUsers();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        result.forEach(val => expect(val.password).toBeUndefined());

    });

    test('should reject with ResourceNotFoundError when getAllUsers fails to get any users from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllUsers();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('should resolve to User when getUserById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            //@ts-ignore
            return new Promise<User>((resolve) => resolve(mockUsers[id - 1]));
        });


        // Act
        let result = await sut.getUserById(1);
        // Assert
        expect(result).toBeTruthy();
        expect(result.ERS_USER_ID).toBe(1);
        // expect(result.password).toBeUndefined();
    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });
    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getUserById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    //got stuck becasue invalid parameter from the first check
    test('should resolve to Member when save() is called with correct newObj', async () =>{
		//Arrange
		expect.assertions(2);
		let newObj = new User(1,'john1eng','password','John','Eng','john234@yahoo.com',1)
		mockRepo.save = jest.fn().mockImplementation(async (newObj) => {
			return newObj;});
		//Act
        let result = await sut.addNewUser(newObj);
        console.log("----------------------------\n", result)
		//Assert
		expect(result).toBeTruthy();
		expect(result.USERNAME).toEqual('john1eng');
	});


})