import { UserSchema } from './schemas';
import { User } from "../models/user";
import { ReimbSchema } from './schemas';
import { Reimb } from "../models/reimb";

export function mapUserResultSet(resultSet: UserSchema): User {
    console.log('iam in result-setmapper')
    if(!resultSet){
        return {} as User;
    }

    return new User(
        resultSet.ers_user_id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.role_name
    );

}

export function mapReimbResultSet(resultSet: ReimbSchema): Reimb {
    console.log('iam in result-setmapper')
    if(!resultSet){
        return {} as Reimb;
    }

    return new Reimb(
        resultSet.reimb_id,
        resultSet.amount,
        resultSet.submitted,
        resultSet.resolved,
        resultSet.description,
        resultSet.receipt,
        resultSet.author_username,
        resultSet.author_first_name,
        resultSet.author_last_name,
        resultSet.resolver_username,
        resultSet.resolver_first_name,
        resultSet.resolver_last_name,
        resultSet.reimb_status,
        resultSet.reimb_type
    );

}