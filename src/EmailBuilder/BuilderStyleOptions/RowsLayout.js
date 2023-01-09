import DoubleLayout from "../Layouts/DoubleLayout";
import SingleLayout from "../Layouts/SingleLayout";
import TripleLayout from "../Layouts/TripleLayout";
import DoubleLeftLongLayout from "../Layouts/DoubleLeftLongLayout";
import DoubleRightLongLayout from "../Layouts/DoubleRightLongLayout";

const RowsLayout = () => {
    const drag = (ev) => {
        ev.dataTransfer.setData("id", ev.target.id);
        ev.dataTransfer.setData("type", 'rows');
    }
    
    return <>
        <div style={{float: 'left', width: '30%', height: '800px', background: '#ECEFF1', marginTop: '10px'}}>
            <SingleLayout id="singleLayout" onDragStart={drag} />
            <DoubleLayout id="doubleLayout" onDragStart={drag} />
            <TripleLayout id="tripleLayout" onDragStart={drag} />
            <DoubleLeftLongLayout id="doubleLeftLongLayout" onDragStart={drag} />
            <DoubleRightLongLayout id="doubleRightLongLayout" onDragStart={drag} />
        </div>
    </>
}

export default RowsLayout