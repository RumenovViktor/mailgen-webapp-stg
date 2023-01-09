import {
    BarChartOutlined, CalendarOutlined, ClockCircleOutlined, LogoutOutlined, MailOutlined,
    RadiusSettingOutlined, ScheduleOutlined, SettingOutlined, ToolOutlined, UsergroupAddOutlined, UserOutlined,
} from '@ant-design/icons';
import {Layout, Menu, Row, Col} from 'antd';
import React, { useState } from 'react';
import useStyles from "./styles";
import {Route, Switch} from "react-router-dom";
import Dashboard from "../Dashboard";
import EmailTemplatesReport from "../EmailTemplates";
import CreateForm from "../EmailForm";
import Audience from "../Audiance";
import EmailTemplate from "../EmailTemplate";
import SimpleEmailTemplate from "../SimpleEmailTemplate";
import CampaignsReport from "../Campaigns";
import CampaignPageLoader from "../CampaignPageLoader";
import AutomationsReport from "../AutoEmails";
import AutoEmailLoader from "../AutoWelcomeEmail/AutoEmailLoader";
import Profile from "../Profile";
import {useHistory} from "react-router-dom";
import RightHeaderItems from "./components/rightHeaderItems";
import LeftHeaderItems from "./components/leftHeaderItems";
import {useAuth0} from "@auth0/auth0-react";
import EmailTemplateBuilder from "../EmailTemplateBuilder V2";
const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, style, children) {
    return {
        key,
        icon,
        children,
        label,
        style: style ? style : {color: 'rgb(26, 51, 83)'}
    };
}

const items = [
    getItem('General', 'sub1', <RadiusSettingOutlined />, null,[
        getItem('Dashboard', 'dashboard', <BarChartOutlined />),
        getItem('Audience', 'audience', <UsergroupAddOutlined />),
    ]),
    getItem('Automation', 'sub2', <ClockCircleOutlined />, null, [
        getItem('Campaigns', 'campaigns', <ScheduleOutlined />), 
        getItem('Automated Emails', 'autoEmails', <CalendarOutlined />)
    ]),
    getItem('Build', 'sub3', <SettingOutlined />, null, [
        getItem('Templates', 'templates', <MailOutlined />),
        getItem('Forms', 'forms', <ToolOutlined />)
    ]),
    getItem('Account', 'account', <UserOutlined />),
    getItem('Logout', 'logout', <LogoutOutlined />)
];

const LeftNavigation = () => {
    const [collapsed, setCollapsed] = useState(false);
    const styles = useStyles();
    const history = useHistory();
    const {logout} = useAuth0()
    
    const onMenuItemSelected = ({item, key}) => {
        switch (key) {
            case 'dashboard':
                history.push("/")
                break;
            case 'audience':
                history.push("/audience")
                break;
            case 'campaigns':
                history.push("/campaigns")
                break;
            case 'autoEmails':
                history.push("/auto-emails")
                break;
            case 'templates':
                history.push("/templates")
                break;
            case 'forms':
                history.push("/build-form")
                break;
            case 'account':
                history.push("/profile")
                break;
            case 'logout':
                logout()
                break;
            default:
                break;
        }
    }
    
    // TODO: Visualize email not verified message 
    return (
        <Layout
            style={{
                minHeight: '100vh',
                color: 'rgb(26, 51, 83)',
            }}
        >
            <Sider style={{boxShadow: 'rgb(0 0 0 / 15%) 0px 1px 4px -1px'}} theme={'light'} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className={styles.logo}>
                    <img height={50} width={50} src="https://s3.amazonaws.com/unroll-images-production/projects%2F1071%2F1645905100627-Untitled+design.svg" />
                    {/*<h4 style={{color: '#455560', fontWeight: "400", fontSize: '16px', marginLeft: 5}}>Mailgen</h4>*/}
                </div>
                <Menu 
                    style={{fontWeight: 500, color: '#455560'}}
                    defaultSelectedKeys={['1']}
                    onClick={onMenuItemSelected}
                    defaultOpenKeys={['sub1']}
                    mode="inline" 
                    items={items}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    className={styles.siteLayoutBackground}
                    style={{
                        padding: 0,
                        height: '70px'
                    }}>
                    <Row>
                        <Col span={8}>
                            <LeftHeaderItems />
                        </Col>
                        <Col span={16}>
                            <RightHeaderItems />
                        </Col>
                    </Row>
                </Header>
                <Content style={{ margin: '16px 50px', }}>
                    <Switch>
                        <Route exact from="/" render={props => <Dashboard {...props} />} />
                        <Route exact path="/templates" render={props => <EmailTemplatesReport {...props} />} />
                        <Route exact path="/build-form" render={props => <CreateForm {...props} />} />
                        <Route exact path="/audience" render={props => <Audience {...props} />} />
                        <Route exact path="/template" render={props => <EmailTemplate {...props} />} />
                        <Route exact path="/simple-template" render={props => <SimpleEmailTemplate {...props} />} />
                        <Route exact path="/campaigns" render={props => <CampaignsReport {...props} />} />
                        <Route exact path="/campaign" render={props => <CampaignPageLoader {...props} />} />
                        <Route exact path="/auto-emails" render={props => <AutomationsReport {...props} />} />
                        <Route exact path="/auto-email" render={props => <AutoEmailLoader {...props} />} />
                        <Route exact path="/profile" render={props => <Profile {...props} />} />
                        <Route exact path="/drag-and-drop" render={props => <EmailTemplateBuilder {...props} />} />
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    );
};

export default LeftNavigation