import java.util.*;
import java.time.*;

public class Regimen{
    private Patient patient;
    private Doctor doctor;
    private String medication;
    private String direction;
    private List<Record> records;
    
    
    Regimen(Patient patient, Doctor doctor, String medication, String direction){
        this.patient = patient;
        this.doctor = doctor;
        this.medication = medication;
        this.direction = direction;
        this.records = new ArrayList<>();
    }

    public void createRecord(LocalDate date, Boolean adherence){
        Record record = new Record(date, adherence);
        addRecord(record);
    }

    public void addRecord(Record record){
        records.add(record);
    }

    public Patient getPatient() {
        return patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public String getMedication() {
        return medication;
    }

    public String getDirection() {
        return direction;
    }

    public List<Record> getRecords() {
        return records;
    }

    public Record getRecord(int i) {
        return records.get(i);
    }
}
