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

export class ReimbRepository implements CrudRepository<Reimb> {
    
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

    async getReimbByUniqueKey(key: string, val: string): Promise<Reimb> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where re.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapReimbResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    
    }

    async save(newReimb: Reimb): Promise<Reimb> {
        let client: PoolClient;
        console.log("i m in reimb repo save")
        try {
            client = await connectionPool.connect();

            // WIP: hacky fix since we need to make two DB calls
            let authorId = (await client.query('select ERS_USER_ID from ERS_USERS where USERNAME = $1', [newReimb.AUTHOR_USERNAME])).rows[0].ers_user_id;
            let statusId = (await client.query('select REIMB_STATUS_ID from ERS_REIMBURSEMENT_STATUSES where REIMB_STATUS = $1', [newReimb.REIMB_STATUS])).rows[0].reimb_status_id;
            let resolverId = (await client.query('select ERS_USER_ID from ERS_USERS where USERNAME = $1', [newReimb.RESOLVER_USERNAME])).rows[0].ers_user_id;
            let typeId = (await client.query('select REIMB_TYPE_ID from ERS_REIMBURSEMENT_TYPES where REIMB_TYPE = $1', [newReimb.REIMB_TYPE])).rows[0].reimb_type_id;

            let sql = `
                insert into ERS_REIMBURSEMENT (amount,submitted,resolved,description,receipt,author_id,resolver_id,reimb_status_id,reimb_type_id) 
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning REIMB_ID
            `;

            let rs = await client.query(sql, [newReimb.AMOUNT, newReimb.SUBMITTED, newReimb.RESOLVED, newReimb.DESCRIPTION, newReimb.RECEIPT, +authorId, +resolverId, +statusId, +typeId]);
            
            newReimb.REIMB_ID = rs.rows[0].reimb_id;
            
            return newReimb;
            
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedReimb: Reimb): Promise<boolean> {
        console.log('im in the repo');   

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            console.log("im trying to connect")
            // WIP: hacky fix since we need to make two DB calls
            let authorId = (await client.query('select ERS_USER_ID from ERS_USERS where USERNAME = $1', [updatedReimb.AUTHOR_USERNAME])).rows[0].ers_user_id;
            console.log('authorid')
            let statusId = (await client.query('select REIMB_STATUS_ID from ERS_REIMBURSEMENT_STATUSES where REIMB_STATUS = $1', [updatedReimb.REIMB_STATUS])).rows[0].reimb_status_id;
            console.log('statusid')
            let resolverId = (await client.query('select ERS_USER_ID from ERS_USERS where USERNAME = $1', [updatedReimb.RESOLVER_USERNAME])).rows[0].ers_user_id;
            console.log('resolverid')
            let typeId = (await client.query('select REIMB_TYPE_ID from ERS_REIMBURSEMENT_TYPES where REIMB_TYPE = $1', [updatedReimb.REIMB_TYPE])).rows[0].reimb_type_id;
            console.log('typeId')
            console.log("im after all the hacky fix");
            let sql = `update ERS_REIMBURSEMENT 
                    set AMOUNT = '${updatedReimb.AMOUNT}', SUBMITTED = '${updatedReimb.SUBMITTED}', RESOLVED = '${updatedReimb.RESOLVED}', DESCRIPTION = '${updatedReimb.DESCRIPTION}', RECEIPT = '${updatedReimb.RECEIPT}', AUTHOR_ID = '${authorId}', RESOLVER_ID = '${resolverId}', REIMB_STATUS_ID = '${statusId}', REIMB_TYPE_ID = '${typeId}'
                    where REIMB_ID = $1`;
            console.log(sql)
            let rs = await client.query(sql, [updatedReimb.REIMB_ID]);
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
