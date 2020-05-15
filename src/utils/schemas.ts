export interface UserSchema {
    ers_user_id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string,
    role_name: string
}

export interface ReimbSchema {
    reimb_id: number,
    amount: number,
    submitted: Date,
    resolved: Date,
    description: string,
    receipt: string,
    author_username:string,
    author_first_name: string,
    author_last_name: string,
    resolver_username: string,
    resolver_first_name: string,
    resolver_last_name: string,
    reimb_status: string,
    reimb_type: string
}