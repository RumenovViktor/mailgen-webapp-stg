import React from "react";
import {Button, Col, Result, Row} from "antd";
import {SmileOutlined} from "@ant-design/icons";
import history from "../utils/history";
import styled from 'styled-components'

const Container = styled.div`
`;

const Title = styled.h1`

`;
const Subtitle = styled.p`
    font-size: 1.5em;
`;

const EmailNotVerified = () => {
    return <>
        <Container>
            <Result
                status="info"
                icon={<SmileOutlined />}
                title={<Title>Almost there!</Title>}
                subTitle={<>
                    <Subtitle>We've sent you an email with a link to activate your account.</Subtitle>
                    <Subtitle>Send us an email at contact@mailgen.org if you need additional help.</Subtitle>
                </>}
            />
        </Container>
    </>
}

export default EmailNotVerified;