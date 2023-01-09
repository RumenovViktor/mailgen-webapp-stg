import React from 'react';
import {Draggable, Droppable} from "react-beautiful-dnd";
import Element from "../Element";
import styled from "styled-components";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';

const Wrapper = styled.div`
    display: flex;
    display-direction: column;
    justify-content: space-between;
    border: 1px solid #90A4AE;
    margin-bottom: 5px;
    margin-top: 5px;
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
    left: 48%;
`;

const OptionsWrapper = styled.div`
    width: 25px;
    height: 25px;
    position: absolute;
    left: 100%;
`;

const Handle = styled.div`
`;

const Container = styled.div`

`;

const HtmlSingleLayout = (props) => {
    const {id, column, elements, index} = props;
    
    return <>
        <Draggable draggableId={id} index={index}>
            {provided => {
                return <Wrapper
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                    <OptionsWrapper>
                        <Handle {...provided.dragHandleProps}>
                            <DragIndicatorIcon />
                        </Handle>
                        <DeleteIcon />
                    </OptionsWrapper>
                    <Container id={id}>
                        {!column.elementIds.length ? <Empty>Drop Here</Empty> : ''}
                        <Droppable droppableId={id} type="column-drag">
                            {(provided) => (
                                <HtmlElementsList {...provided.droppableProps} ref={provided.innerRef}>
                                    {column.elementIds.map((elementId, index) => {
                                        const element = elements[elementId];
                                        return <Element key={element.id} index={index} element={element} />
                                    })}
                                    {provided.placeholder}
                                </HtmlElementsList>
                            )}
                        </Droppable>
                    </Container>
                </Wrapper>
            }}
        </Draggable>
    </>
}

export default HtmlSingleLayout;