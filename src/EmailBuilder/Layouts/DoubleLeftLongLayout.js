import React from 'react'
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    border: 1px solid #90A4AE;
    border-radius: 10px;
    width: 90%;
    height: 100px;
    margin-left: 5%;
    margin-top: 3%;
    background-color: white;
    padding-top: 10px;
`;

const LeftInnerContainer = styled.div`
    border: 1.5px dashed #90A4AE;
    border-radius: 10px;
    width: 60%;
    height: 50%;
    margin-left: 5%;
    margin-top: 3%;
    background-color: rgb(236, 239, 241);
`;

const RightInnerContainer = styled.div`
    border: 1.5px dashed #90A4AE;
    border-radius: 10px;
    width: 25%;
    height: 50%;
    margin-left: 5%;
    margin-top: 3%;
    background-color: rgb(236, 239, 241);
`;

const DoubleLeftLongLayout = (props) => {
    const {id, onDragStart} = props;

    return <>
        <Container id={id} onDragStart={event => onDragStart(event)}>
            <LeftInnerContainer />
            <RightInnerContainer />
        </Container>
    </>
}

export default DoubleLeftLongLayout