import {readFileSync} from 'fs'; // Importing the file system module to read files

// Class to store the types of user information
class User {
    constructor(userType, firstname, username, email, id, password, type) {
        this.userType = userType; 
        this.firstname = firstname;
        this.username = username; // null if not required
        this.email = email; // null if not required
        this.id = id; // null if not required
        this.password = password;
    }
}

export { users };
