import React from 'react'
import styled from 'styled-components'
import {Draggable} from "react-beautiful-dnd";

const Container = styled.div`
    width: 100%;
    border: 1px solid black;
    padding: 10px;
    background-color: white;
`;

const Element = (props) => {
    const {element, index} = props;
    
    return <>
        <Draggable index={index} draggableId={element.id.toString()}>
            {(provided) => (
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    {element.content}
                </Container>
            )}
        </Draggable>
    </>
}

export default Element;