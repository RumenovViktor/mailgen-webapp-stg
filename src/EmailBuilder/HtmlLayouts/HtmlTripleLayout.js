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
    width: 33.0%;
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
    left: 33%;
`;

const OptionsWrapper = styled.div`
    width: 25px;
    height: 25px;
    position: absolute;
    left: 100%;
`;

const Handle = styled.div`
`;

const HtmlTripleLayout = (props) => {
    const {firstColumn, secondColumn, thirdColumn, elements, index} = props;
    
    const renderElements = (column) => {
        return column.elementIds.map((elementId, index) => {
            const element = elements[elementId];
            return <Element key={element.id} index={index} element={element}/>
        });
    }

    return <>
        <Draggable draggableId={`${firstColumn.id}`} index={index}>
            {provided => {
                return <>
                    <Wrapper {...provided.draggableProps}
                             ref={provided.innerRef}>
                        <Container
                            id={firstColumn.id}>
                            {!firstColumn.elementIds.length ? <Empty>Drop Here</Empty> : ''}
                            <Droppable droppableId={firstColumn.id} type="column-drag">
                                {(provided) => (
                                    <HtmlElementsList {...provided.droppableProps} ref={provided.innerRef}>
                                        {renderElements(firstColumn)}
                                        {provided.placeholder}
                                    </HtmlElementsList>
                                )}
                            </Droppable>
                        </Container>
                        <Container
                            id={secondColumn.id}>
                            {!secondColumn.elementIds.length ? <Empty>Drop Here</Empty> : ''}
                            <Droppable droppableId={secondColumn.id} type="column-drag">
                                {(provided) => (
                                    <HtmlElementsList {...provided.droppableProps} ref={provided.innerRef}>
                                        {renderElements(secondColumn)}
                                        {provided.placeholder}
                                    </HtmlElementsList>
                                )}
                            </Droppable>
                        </Container>
                        <Container
                            id={thirdColumn.id}>
                            {!thirdColumn.elementIds.length ? <Empty>Drop Here</Empty> : ''}
                            <Droppable droppableId={thirdColumn.id} type="column-drag">
                                {(provided) => (
                                    <HtmlElementsList {...provided.droppableProps} ref={provided.innerRef}>
                                        {renderElements(thirdColumn)}
                                        {provided.placeholder}
                                    </HtmlElementsList>
                                )}
                            </Droppable>
                        </Container>
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

export default HtmlTripleLayout;