import { Doctor } from './Doctor.js';
import { Patient } from './Patient.js';

export class MedicalManager {
    constructor() {
        this.doctors = [];
        this.patients = [];
        this.currentUser = null;
    }

    // Doctor management
    addDoctor(doctor) {
        if (!(doctor instanceof Doctor)) {
            throw new Error('Only Doctor instances can be added');
        }
        this.doctors.push(doctor);
        return doctor;
    }

    createDoctor(firstName, lastName) {
        const doctor = new Doctor(firstName, lastName);
        return this.addDoctor(doctor);
    }

    getDoctorById(id) {
        return this.doctors[id];
    }

    getAllDoctors() {
        return [...this.doctors]; // Return a copy to prevent direct modification
    }

    // Patient management
    addPatient(patient) {
        if (!(patient instanceof Patient)) {
            throw new Error('Only Patient instances can be added');
        }
        this.patients.push(patient);
        return patient;
    }

    createPatient(firstName, lastName, year, month, day) {
        const patient = new Patient(firstName, lastName, year, month, day);
        return this.addPatient(patient);
    }

    getPatientById(id) {
        return this.patients[id];
    }

    getAllPatients() {
        return [...this.patients]; // Return a copy to prevent direct modification
    }

    // User session management
    loginAsDoctor(doctorId) {
        this.currentUser = this.getDoctorById(doctorId);
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Search functionality
    findDoctorByName(firstName, lastName) {
        return this.doctors.find(doc => 
            doc.getFirstName() === firstName && 
            doc.getLastName() === lastName
        );
    }

    findPatientByName(firstName, lastName) {
        return this.patients.find(patient => 
            patient.getFirstName() === firstName && 
            patient.getLastName() === lastName
        );
    }

    // Data persistence
    saveToLocalStorage() {
        const data = {
            doctors: this.doctors.map(doc => ({
                firstName: doc.getFirstName(),
                lastName: doc.getLastName(),
                patients: doc.getPatients().map(patient => 
                    this.patients.indexOf(patient)
                ),
                regimens: doc.getRegimens().map(regimen => ({
                    patientId: this.patients.indexOf(regimen.getPatient()),
                    medication: regimen.getMedication(),
                    direction: regimen.getDirection(),
                    records: regimen.getRecords().map(record => ({
                        date: record.getDate().toISOString(),
                        adherence: record.getAdherence()
                    }))
                }))
            })),
            patients: this.patients.map(patient => ({
                firstName: patient.getFirstName(),
                lastName: patient.getLastName(),
                dateOfBirth: patient.getDateOfBirth().toISOString(),
                regimens: patient.getRegimens().map(regimen => 
                    this.doctors.flatMap(doc => doc.getRegimens()).indexOf(regimen)
                )
            }))
        };
        localStorage.setItem('medicalData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('medicalData'));
        if (!data) return;

        // Clear current data
        this.doctors = [];
        this.patients = [];

        // Recreate patients first
        data.patients.forEach(patientData => {
            const dob = new Date(patientData.dateOfBirth);
            const patient = this.createPatient(
                patientData.firstName,
                patientData.lastName,
                dob.getFullYear(),
                dob.getMonth() + 1,
                dob.getDate()
            );
        });

        // Recreate doctors and their relationships
        data.doctors.forEach(doctorData => {
            const doctor = this.createDoctor(
                doctorData.firstName,
                doctorData.lastName
            );

            // Add patients to doctor
            doctorData.patients.forEach(patientId => {
                doctor.addPatient(this.patients[patientId]);
            });

            // Recreate regimens
            doctorData.regimens.forEach(regimenData => {
                const patient = this.patients[regimenData.patientId];
                const regimen = doctor.createRegimen(
                    patient,
                    regimenData.medication,
                    regimenData.direction
                );

                // Recreate records
                regimenData.records.forEach(recordData => {
                    regimen.createRecord(
                        new Date(recordData.date),
                        recordData.adherence
                    );
                });
            });
        });
    }
}

// Singleton instance
export const medicalManager = new MedicalManager();