/**
 * setting to call one instance for Repository and Services
 */
import { UserRepository } from '../repos/user-repo';
import { UserService } from '../services/user-service';
import { ReimbRepository } from '../repos/reimb-repo';
import { ReimbService } from '../services/reimb-service';
import { EmplReimbRepository } from '../repos/emplReimb-repo';
import { EmplReimbService } from '../services/emplReimb-service';

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const reimbRepo = new ReimbRepository();
const reimbService = new ReimbService(reimbRepo);
const emplReimbRepo = new EmplReimbRepository();
const emplReimbService = new EmplReimbService(emplReimbRepo);

export default {
    userService,
    reimbService,
    emplReimbService,
}