export default function parseCsv(csv){
    const columnsAndValuesSplit = csv.split('\n')
    const values = columnsAndValuesSplit.slice(1).filter(x => x.length)
    
    return values.map((x, index) => {
        const result = x.split(',')

        return {
            id: index,
            firstName: result[0],
            lastName: result[1],
            email: result[2],
            birthDate: result[3],
            phoneNumber: result[4]
        }
    })
}