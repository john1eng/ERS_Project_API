import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import {
    NotImplementedError, 
    ResourceNotFoundError, 
    ResourcePersistenceError,
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../utils/result-set-mapper';

export class UserRepository implements CrudRepository<User> {
    
    baseQuery = `
    select
        au.ERS_USER_ID, 
        au.USERNAME, 
        au.PASSWORD, 
        au.first_name,
        au.last_name,
        au.email,
        ur.ROLE_NAME
    from ers_users au
    join ERS_USER_ROLES ur
    on au.USER_ROLE_ID = ur.ROLE_ID
`   ;
    
    async getAll(): Promise<User[]> {
        console.log('im in the repo');
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            console.log(rs)
            return rs.rows.map(mapUserResultSet);
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async getById(id: number): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.ERS_USER_ID = $1`;
            let rs = await client.query(sql, [id]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    

    }

    async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    
    }

    async getUserByCredentials(un: string, pw: string) {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.USERNAME = $1 and au.PASSWORD = $2`;
            let rs = await client.query(sql, [un, pw]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async save(newUser: User): Promise<User> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            // WIP: hacky fix since we need to make two DB calls
            // let roleId = (await client.query('select ROLE_ID from USER_ROLES where ROLE_NAME = $1', [newUser.ROLE_ID])).rows[0].id;
            
            let sql = `
                insert into ERS_USERS (username,password,first_name,last_name,email,user_role_id) 
                values ($1, $2, $3, $4, $5, $6) returning ERS_USER_ID
            `;

            let rs = await client.query(sql, [newUser.USERNAME, newUser.PASSWORD, newUser.FIRST_NAME, newUser.LAST_NAME, newUser.EMAIL, newUser.USER_ROLE_ID]);
            
            newUser.ERS_USER_ID = rs.rows[0].ERS_USER_ID;
            
            return newUser;
            
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedUser: User): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `update ERS_USERS 
                    set username = '${updatedUser.USERNAME}', password = '${updatedUser.PASSWORD}', first_name = '${updatedUser.FIRST_NAME}', last_name = '${updatedUser.LAST_NAME}' ,email = '${updatedUser.EMAIL}', user_role_id = '${updatedUser.USER_ROLE_ID}
                    where ERS_USER_ID =$1`;
            let rs = await client.query(sql, [updatedUser.ERS_USER_ID]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `delete from ERS_USERS where ERS_USER_ID = $1`;
            let rs = await client.query(sql, [id]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

}
