class NumberFormatter{
    constructor() {
        this.ranges = [
            { divider: 1e9 , suffix: 'B' },
            { divider: 1e6 , suffix: 'M' },
            { divider: 1e3 , suffix: 'k' }
        ]
    }
    
    format(number) {
        for (let i = 0; i < this.ranges.length; i++) {
            if (number >= this.ranges[i].divider) {
                return (number / this.ranges[i].divider).toString() + this.ranges[i].suffix;
            }
        }
        return number.toString();
    }
}

export default NumberFormatter