import { Patient } from './Patient.js';
import { Regimen } from './Regimen.js';

export class Doctor {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.patients = [];
        this.regimens = [];
    }

    addPatient(patient) {
        this.patients.push(patient);
    }

    createPatient(firstName, lastName, year, month, day) {
        const patient = new Patient(firstName, lastName, year, month, day);
        this.addPatient(patient);
        return patient;
    }

    createRegimen(patient, medication, direction) {
        const regimen = new Regimen(patient, this, medication, direction);
        this.addRegimen(regimen);
        patient.addRegimen(regimen);
        return regimen;
    }

    addRegimen(regimen) {
        this.regimens.push(regimen);
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getPatients() {
        return this.patients;
    }

    getPatient(i) {
        return this.patients[i];
    }

    getRegimens() {
        return this.regimens;
    }

    getRegimen(i) {
        return this.regimens[i];
    }
}