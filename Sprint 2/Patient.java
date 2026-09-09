import java.util.*;
import java.time.*;

public class Patient{
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private List<Regimen> regimens;

    


    Patient(String firstName, String lastName, int year, int month, int day){
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = LocalDate.of(year, month, day);
        this.regimens = new ArrayList<>();
    }

    public void addRegimen(Regimen regimen){
        regimens.add(regimen);
    }

    public void markAdherence(Boolean adherence, Regimen regimen){
        LocalDate date = LocalDate.now();
        regimen.createRecord(date, adherence)
    }
    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public List<Regimen> getRegimens() {
        return regimens;
    }

    public Regimen getRegimen(int i) {
        return regimens.get(i);
    }


}


 