import React from 'react'
import styled from 'styled-components'
import {Droppable} from "react-beautiful-dnd";
import Element from "./Element";

const Container = styled.div`
    border: 1px solid #90A4AE;
    width: 100%; 
    height: 15%;
    margin-bottom: 10px;
    text-align: center;
    position: relative;
    
`;

const HtmlElementsList = styled.div`
    
`;

const Empty = styled.div`
    color: #90A4AE;
    font-size: 1.2em;
    position: absolute;
    top: 43%;
    left: 48%;
`;

const Column = (props) => {
    const {id, column, elements} = props;

    return <>
        <Container id={id}>
            {!column.elementIds.length ? <Empty>Drop Here</Empty> : ''}
            <Droppable droppableId={id}>
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
    </>
}

// export default Column