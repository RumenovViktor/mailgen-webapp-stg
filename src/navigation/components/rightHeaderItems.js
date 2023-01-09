import {RocketOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import styled from 'styled-components';
import {Button, Space} from "antd";
import {useHistory} from "react-router-dom";

const Container = styled.div`
    float: right;
    height: 0px;
    color: rgb(26, 51, 83);
    padding-right: 50px;
`

const AnchorContainer = styled.a`
    padding: 10px;
`

const RightHeaderItems = () => {
    const history = useHistory();

    return <>
        <Container>
            <Space align={"center"}>
                <Button
                    size="middle"
                    icon={<RocketOutlined/>}
                    onClick={() => history.push('/profile?tab=billing')} shape="round" type="primary">
                    Upgrade
                </Button>
                <AnchorContainer
                    href="/profile">
                    <UserOutlined style={{fontSize: '1.4rem', color: "#455560"}}/>
                </AnchorContainer>
            </Space>
        </Container>
    </>
}

export default RightHeaderItems