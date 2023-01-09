class DateRange{
    constructor(from, to) {
        this.from = from
        this.to = to
    }
    
    get From () { 
        return this.from
    };

    get To () {
        return this.to
    };
    
    validate(){
        return this.To >= this.From
    }
}

export default DateRange