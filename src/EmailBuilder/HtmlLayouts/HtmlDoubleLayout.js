import React from 'react';
import {Draggable, Droppable} from "react-beautiful-dnd";
import Element from "../Element";
import styled from "styled-components";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;
`;

const Container = styled.div`
    display: flex;
    display-direction: column;
    justify-content: space-between;
    border: 1px solid #90A4AE;
    width: ${props => props.width};
    margin-bottom: 5px;
    text-align: center;
    position: relative;    
`;

const HtmlElementsList = styled.div`
    flex-grow: 1;
    min-height: 100px;
`;

const Empty = styled.div`
    color: #90A4AE;
    font-size: 1.2em;
    position: absolute;
    top: 43%;
    left: 40%;
`;

const OptionsWrapper = styled.div`
    width: 25px;
    height: 25px;
    position: absolute;
    left: 100%;
`;

const Handle = styled.div`
`;

const HtmlDoubleLayout = (props) => {
    const {firstColumn, secondColumn, elements, index} = props;

    const getContainerType = (column) => {
        const hasLongWidthPart = firstColumn.lengthType === 'long' || secondColumn.lengthType === 'long';
        const dimensions = {
            normal: '49.7%',
            long: '66.7%',
            short: '33%'
        }
        
        if (column.lengthType === 'long'){
            return <>
                <Container
                    id={column.id}
                    width={dimensions.long}>
                    {!column.elementIds.length ? <Empty>Drop Here</Empty> : ''}
                    <Droppable droppableId={column.id} type="column-drag">
                        {(provided) => (
                            <HtmlElementsList {...provided.droppableProps} ref={provided.innerRef}>
                                {column.elementIds.map((elementId, index) => {
                                    const element = elements[elementId];
                                    return <Element key={element.id} index={index} element={element}/>
                                })}
                                {provided.placeholder}
                            </HtmlElementsList>
                        )}
                    </Droppable>
                </Container>
            </>
        }
        
        return <>
            <Container
                id={column.id}
                width={hasLongWidthPart ? dimensions.short : dimensions.normal}>
                {!column.elementIds.length ? <Empty>Drop Here</Empty> : ''}
                <Droppable droppableId={column.id} type="column-drag">
                    {(provided) => (
                        <HtmlElementsList {...provided.droppableProps} ref={provided.innerRef}>
                            {column.elementIds.map((elementId, index) => {
                                const element = elements[elementId];
                                return <Element key={element.id} index={index} element={element}/>
                            })}
                            {provided.placeholder}
                        </HtmlElementsList>
                    )}
                </Droppable>
            </Container>
        </>
    }
    
    return <>
        <Draggable draggableId={`${firstColumn.id}`} index={index}>
            {provided => {
                return <>
                    <Wrapper {...provided.draggableProps}
                             ref={provided.innerRef}>
                        {getContainerType(firstColumn)}
                        {getContainerType(secondColumn)}
                        <OptionsWrapper>
                            <Handle {...provided.dragHandleProps}>
                                <DragIndicatorIcon />
                            </Handle>
                            <DeleteIcon />
                        </OptionsWrapper>
                    </Wrapper>
                </>
            }}
        </Draggable>
    </>
}

export default HtmlDoubleLayout;