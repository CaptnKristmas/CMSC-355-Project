public class Record{
    private LocalDate date;
    private Boolean adherence;

    Record(LocalDate date, Boolean adherence){
        this.date = date;
        this.adherence = new Boolean(adherence);
    }

    public LocalDate getDate() {
        return date;
    }

    public Boolean getAdherence() {
        return adherence;
    }
}