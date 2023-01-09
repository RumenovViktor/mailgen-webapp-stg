class CustomNumber{
    constructor(number, formatter) {
        this.number = number;
        this.formatter = formatter;
    }
    
    get Value() {
        if (this.formatter){
            return this.formatter.format(this.number)
        }
        
        return this.number;
    }
}

export default CustomNumber