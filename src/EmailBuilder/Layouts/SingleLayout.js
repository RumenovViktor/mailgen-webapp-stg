import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
    border: 1px solid #90A4AE;
    border-radius: 10px;
    width: 90%;
    height: 100px;
    margin-left: 5%;
    margin-top: 3%;
    background-color: white;
    padding-top: 10px;
    position: relative;
`;

const InnerContainer = styled.div`
    border: 1.5px dashed #90A4AE;
    border-radius: 10px;
    width: 90%;
    height: 50%;
    margin-left: 5%;
    margin-top: 3%;
    background-color: rgb(236, 239, 241);
`;

const Mask = styled.div`
    position: absolute;
    color: transparent;
    width: 100%;
    height: 100%;
`;

const SingleLayout = (props) => {
    const {id, onDragStart} = props;
    
    return <>
        <Container id={id} onDragStart={event => onDragStart(event)}>
            {/*<Mask />*/}
            <InnerContainer />
        </Container>
    </>
}

export default SingleLayout