/**use for transfering data from authenticaluser() to principal
 * dto use for map out the data before transfering it to the client
 */

export class Principal {

    id: number;
    username: string;
    role: string;

    constructor(id: number, un: string, role: string) {
        this.id = id;
        this.username = un;
        this.role = role;
    }
    
}