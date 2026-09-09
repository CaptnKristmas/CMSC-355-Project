export class Record {
    constructor(date, adherence) {
        this.date = date;
        this.adherence = adherence;
    }

    getDate() {
        return this.date;
    }

    getAdherence() {
        return this.adherence;
    }
}