import { Record } from './Record.js';

export class Regimen {
    constructor(patient, doctor, medication, direction) {
        this.patient = patient;
        this.doctor = doctor;
        this.medication = medication;
        this.direction = direction;
        this.records = [];
    }

    createRecord(date, adherence) {
        const record = new Record(date, adherence);
        this.addRecord(record);
    }

    addRecord(record) {
        this.records.push(record);
    }

    getPatient() {
        return this.patient;
    }

    getDoctor() {
        return this.doctor;
    }

    getMedication() {
        return this.medication;
    }

    getDirection() {
        return this.direction;
    }

    getRecords() {
        return this.records;
    }

    getRecord(i) {
        return this.records[i];
    }
}