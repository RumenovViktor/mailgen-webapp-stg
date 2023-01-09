import React from "react";
import ImageIcon from '@mui/icons-material/Image';
import styled from 'styled-components';

const Container = styled.div`
    text-align: center;
    color: #90A4AE;
    width: 23.5%;
    height: 100px;
    border: 1px solid black;
    display: inline-block;
    margin-left: 0.5%;
    margin-right: 1%;
    margin-top: 1.5%;
    border-color: #90A4AE;
    border-radius: 10px;
`;

const InnerContainer = styled.div`
    margin-top: 10%;
`;

const Text = styled.div`
    font-size: 1.3em;
`;

const ImageElement = (props) => {
    const {id, onDragStart} = props;

    return <>
        <Container id={id} onDragStart={onDragStart} draggable="true">
            <InnerContainer>
                <ImageIcon style={{fontSize: '3.2em'}}/>
                <Text>Image</Text>
            </InnerContainer>
        </Container>
    </>
}

export default ImageElement;