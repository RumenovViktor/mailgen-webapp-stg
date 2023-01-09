import React from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    text-align: center;
    background-color: #ECEFF1;
`;

const Text = styled.span`
    text-align: center;
    font-weight: lighter;
    font-size: 1.3em;
`;

const Image = styled.img`
    width: 5%;
    margin-left: ;.5%
`;

const MailgenElement = () => {
    const getLocation = () => window.location.protocol + '//' + window.location.host + '/mailgen-logo.svg';
    
    return <>
        <Container >
            <Text>Powered by </Text>
            <Image src={getLocation()} />
            <Text>Mailgen</Text>
        </Container>
    </>
}

export default MailgenElement