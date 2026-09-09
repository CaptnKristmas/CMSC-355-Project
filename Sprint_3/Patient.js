import { Regimen } from './Regimen.js';

export class Patient {
    constructor(firstName, lastName, year, month, day) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = new Date(year, month - 1, day); // Note: JS months are 0-indexed
        this.regimens = [];
    }

    addRegimen(regimen) {
        this.regimens.push(regimen);
    }

    markAdherence(adherence, regimen) {
        const date = new Date();
        regimen.createRecord(date, adherence);
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getDateOfBirth() {
        return this.dateOfBirth;
    }

    getRegimens() {
        return this.regimens;
    }

    getRegimen(i) {
        return this.regimens[i];
    }
}