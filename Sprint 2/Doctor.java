import java.util.*;
import java.time.*;

public class Doctor{
    private String firstName;
    private String lastName;
    private List<Patient> patients;
    private List<Regimen> regimens;

    Doctor(String firstName, String lastName){
        this.firstName = firstName;
        this.lastName = lastName;
        this.patients = new ArrayList<>(); 
        this.regimens = new ArrayList<>();
    }

    public void addPatient(Patient patient){
        patients.add(patient);
    }

    public void createPatient(String firstName, String lastName, int year, int month, int day){
        Patient patient = new Patient(firstName, lastName, year, month, day);
        addPatient(patient);
    }

    public void createRegimen(Patient patient, String medication, String direction){
        Regimen regimen = new Regimen(patient, this.Doctor, medication, direction);
        addRegimen(regimen);
        patient.addRegimen(regimen);
    }

    public void addRegimen(Regimen regimen){
        regimens.add(regimen);
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public Patient getPatient(int i) {
        return patients.get(i);
    }

    public List<Regimen> getRegimens() {
        return regimens;
    }

    public Regimen getRegimen(int i) {
        return regimens.get(i);
    }
}