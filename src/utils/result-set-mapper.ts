import { UserSchema } from './schemas';
import { User } from "../models/user";

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
        resultSet.user_role_id
    );

}