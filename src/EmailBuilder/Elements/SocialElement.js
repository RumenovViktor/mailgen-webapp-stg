import React from "react";
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import styled from "styled-components";

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
    margin-top: 10%
`;

const Text = styled.div`
    font-weight: bold;
    font-size: 2.5em;
`;
const Title = styled.div`
    font-size: 1.3em;
`;

const SocialElement = (props) => {
    const {id, onDragStart} = props;

    return <>
        <Container id={id} onDragStart={onDragStart} draggable="true">
            <InnerContainer>
                <ConnectWithoutContactIcon style={{fontSize: '3.2em'}}/>
                <Title >Social</Title>
            </InnerContainer>
        </Container>
    </>
}

export default SocialElement