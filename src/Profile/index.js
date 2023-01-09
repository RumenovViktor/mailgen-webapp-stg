import React, {useEffect, useState} from 'react'
import PasswordManagement from "./components/PasswordManagement";
import BillingInformation from "./components/BillingInformation";
import GeneralInformation from "./components/GeneralInformation";
import Integrations from "./components/integrations/Integrations";
import { Tabs } from 'antd';
import styled from 'styled-components'
import {useHistory} from "react-router-dom";
import queryString from "query-string";
import {RocketOutlined, WalletOutlined, SettingOutlined, ApiOutlined} from "@ant-design/icons";
import SendingSettings from "./components/SendingSettings";
const { TabPane } = Tabs;

const Container = styled.div`
    margin-top: 16px;
    height: 95%;
    padding: 20px;
    background-color: white;
    border: 1px solid #e6ebf1;
    border-radius: 10px;
    color: #fafafb !important;
`;

const Profile = (props) => {
    const [activeKey, setActiveKey] = useState('1')
    
    const history = useHistory();
    const query = queryString.parse(props.location.search)
    
    const onTabChange = (tab) => {
        setActiveKey(tab)
        switch (tab){
            case 'account':
                history.push('/profile')
                break;
            case 'billing':
                history.push('/profile?tab=billing')
                break;
            case 'passManagement':
                history.push('/profile?tab=passManagement')
                break;
            case 'integrations':
                history.push('/profile?tab=integrations')
                break;
            case 'sendingSettings':
                history.push('/profile?tab=sendingSettings')
                break;
            default:
                break;
        }
    }
    
    useEffect(() => {
        setActiveKey(query.tab)
    }, [query])
    
    return <>
        <Container>
            <Tabs onTabClick={onTabChange} activeKey={activeKey} tabPosition="left" style={{height: '100%', backgroundColor: 'white'}}>
                <TabPane tab={
                    <span>
                      <RocketOutlined />
                      Account
                    </span>
                } key="account">
                    <GeneralInformation isActive={activeKey === 'account'} />
                </TabPane>
                <TabPane tab={
                    <span>
                        <WalletOutlined />
                        Billing
                    </span>
                } key="billing">
                    <BillingInformation />
                </TabPane>
                <TabPane tab={
                    <span>
                        <SettingOutlined />
                        Password Management
                    </span>
                } key="passManagement">
                    <PasswordManagement />
                </TabPane>
                {/*<TabPane tab={*/}
                {/*    <span>*/}
                {/*        <ApiOutlined />*/}
                {/*        Integrations*/}
                {/*    </span>*/}
                {/*} key="integrations">*/}
                {/*    <Integrations />*/}
                {/*</TabPane>*/}
                <TabPane tab={
                    <span>
                        <ApiOutlined />
                        Sending Settings
                    </span>
                } key="sendingSettings">
                    <SendingSettings />
                </TabPane>
            </Tabs>
        </Container>
    </>
}

export default Profile