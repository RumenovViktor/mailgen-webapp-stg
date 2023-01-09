import ElementsLayout from "./ElementsLayout";
import RowsLayout from "./RowsLayout";

const BuilderStyleFactory = (props) => {
    const {selectedOption} = props
    
    return <>
        {selectedOption === 'elements' ? <ElementsLayout /> : <RowsLayout />}
    </>
}

export default BuilderStyleFactory