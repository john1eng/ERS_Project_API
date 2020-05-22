/**
 * this repository inplement the CRUD for ers_reimbursement table by calling, updating, deleting, saving info from the database.
 * implement by dirrectly calling the database
 */
import { Reimb } from '../models/reimb';
import { CrudRepository } from './crud-repo';
import {
    NotImplementedError, 
    ResourceNotFoundError, 
    ResourcePersistenceError,
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapReimbResultSet } from '../utils/result-set-mapper';

export class EmplReimbRepository implements CrudRepository<Reimb> {
    
    baseQuery = `
    select
    re.REIMB_ID, 
    re.AMOUNT, 
    re.SUBMITTED, 
    re.RESOLVED,
    re.DESCRIPTION,
    re.RECEIPT,
    us.username as author_username,
    us.first_name as author_first_name,
    us.last_name as author_last_name,
    st.reimb_status,
    rs.username as resolver_username,
    rs.first_name as resolver_first_name,
    rs.last_name as resolver_last_name,
    ty.reimb_type 
    from ers_reimbursement re
    left join ERS_USERS us
    on re.AUTHOR_ID = us.ers_user_id
    left join ers_reimbursement_statuses st
    on re.reimb_status_id = st.reimb_status_id
    left join ers_users rs
    on re.resolver_id = rs.ers_user_id
    left join ers_reimbursement_types ty
    on re.reimb_type_id = ty.reimb_type_id
    `;
   

    async getAll(): Promise<Reimb[]> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} order by re.reimb_id`;
            let rs = await client.query(sql); // rs = ResultSet
            console.log(rs)
            return rs.rows.map(mapReimbResultSet);
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async getById(id: number): Promise<Reimb> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where re.reimb_id = $1`;
            let rs = await client.query(sql, [id]);
            return mapReimbResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async getByUserName(username: string): Promise<Reimb[]> {
        console.log('im in router of getEmplReimbByUserName')
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where us.USERNAME = $1`;
            let rs = await client.query(sql, [username]);
            return rs.rows.map(mapReimbResultSet);
        } catch (e) {
            console.log(e)
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getEmplReimbByUniqueKey(key: string, val: string): Promise<Reimb[]> {
        console.log('I\'m in getEmplReimbByUniqueKey repo', key, val)
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where re.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return rs.rows.map(mapReimbResultSet);
        } catch (e) {
            console.log(e)
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    
    }

    async save(newEmplReimb: Reimb): Promise<Reimb> {
        let client: PoolClient;
        console.log("i m in reimb repo save")
        try {
            client = await connectionPool.connect();

            // WIP: hacky fix since we need to make two DB calls
            let authorId = (await client.query('select ERS_USER_ID from ERS_USERS where USERNAME = $1', [newEmplReimb.AUTHOR_USERNAME])).rows[0].ers_user_id;
            console.log("im after the hacky fix")
            let statusId = (await client.query('select REIMB_STATUS_ID from ERS_REIMBURSEMENT_STATUSES where REIMB_STATUS = $1', [newEmplReimb.REIMB_STATUS])).rows[0].reimb_status_id;
            console.log("im after the hacky fix")
            let typeId = (await client.query('select REIMB_TYPE_ID from ERS_REIMBURSEMENT_TYPES where REIMB_TYPE = $1', [newEmplReimb.REIMB_TYPE])).rows[0].reimb_type_id;
            console.log("im after the hacky fix")
            let sql = `
                insert into ERS_REIMBURSEMENT (amount,submitted,description,receipt,author_id,reimb_status_id,reimb_type_id) 
                values ($1, $2, $3, $4, $5, $6, $7) returning REIMB_ID
            `;

            let rs = await client.query(sql, [newEmplReimb.AMOUNT, newEmplReimb.SUBMITTED, newEmplReimb.DESCRIPTION, newEmplReimb.RECEIPT, +authorId, +statusId, +typeId]);
            
            newEmplReimb.REIMB_ID = rs.rows[0].reimb_id;
            
            return newEmplReimb;
            
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedEmplReimb: Reimb): Promise<boolean> {
        console.log('im in the repoaaa');   

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            console.log("im trying to connect, why")
 
            let typeId = (await client.query('select REIMB_TYPE_ID from ERS_REIMBURSEMENT_TYPES where REIMB_TYPE = $1', [updatedEmplReimb.REIMB_TYPE])).rows[0].reimb_type_id;
            console.log('typeId')

            let sql = `update ERS_REIMBURSEMENT 
                    set AMOUNT = '${updatedEmplReimb.AMOUNT}', DESCRIPTION = '${updatedEmplReimb.DESCRIPTION}', RECEIPT = '${updatedEmplReimb.RECEIPT}', REIMB_TYPE_ID = '${typeId}'
                    where REIMB_ID = $1`;
            console.log(sql)
            let rs = await client.query(sql, [updatedEmplReimb.REIMB_ID]);
            return true;
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `delete from ERS_REIMBURSEMENT where REIMB_ID = $1`;
            let rs = await client.query(sql, [id]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

}
